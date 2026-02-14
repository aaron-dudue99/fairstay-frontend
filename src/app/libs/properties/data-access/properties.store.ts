import { inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withState, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { PropertiesApi } from './properties.api';
import { Property, PropertyRequest, Unit, UnitRequest } from './properties.models';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

export type PropertyStatusState = 'idle' | 'loading' | 'success' | 'error';

export interface PropertiesState {
  properties: Property[];
  units: Record<string, Unit[]>; // propertyId -> Unit[]
  currentPropertyId: string | null;
  status: PropertyStatusState;
  error: string | null;
  workflow: {
    fetching: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
  };
}

const IDLE = 'idle' as const;
const LOADING = 'loading' as const;
const SUCCESS = 'success' as const;
const ERROR = 'error' as const;

export const PropertiesStore = signalStore(
  { providedIn: 'root' },
  withDevtools('properties'),
  withState<PropertiesState>({
    properties: [],
    units: {},
    currentPropertyId: null,
    status: IDLE,
    error: null,
    workflow: {
      fetching: false,
      creating: false,
      updating: false,
      deleting: false,
    },
  }),
  withComputed((store) => ({
    currentProperty: () => {
      const id = store.currentPropertyId();
      return id ? store.properties().find((p) => p.id === id) ?? null : null;
    },
    isBusy: () => {
      const w = store.workflow();
      return w.fetching || w.creating || w.updating || w.deleting;
    },
    totalProperties: () => store.properties().length,
    totalUnits: () => {
      return Object.values(store.units())
        .reduce((acc, units) => acc + units.length, 0);
    },
    totalOccupied: () => {
      return Object.values(store.units())
        .flat()
        .filter((u) => u?.status === 'OCCUPIED').length;
    },
    totalVacant: () => {
      return Object.values(store.units())
        .flat()
        .filter((u) => u?.status === 'VACANT').length;
    },
  })),
  withMethods((store) => {
    const api = inject(PropertiesApi);

    function setWorkflow<K extends keyof PropertiesState['workflow']>(key: K, value: boolean) {
      patchState(store, (state) => ({
        workflow: { ...state.workflow, [key]: value },
      }));
    }

    return {
      loadProperties: rxMethod<void>(
        switchMap(() => {
          patchState(store, { status: LOADING, error: null });
          setWorkflow('fetching', true);
          return api.getProperties().then(
            (properties) => {
              patchState(store, { properties, status: SUCCESS });
            },
            (err) => {
              patchState(store, { status: ERROR, error: err?.message || 'Failed to load properties' });
            }
          ).finally(() => {
            setWorkflow('fetching', false);
            patchState(store, { status: IDLE });
          });
        })
      ),

      loadUnits: rxMethod<string>(
        switchMap((propertyId) => {
          // Don't set global loading status for units to avoid flickering whole page
          return api.getUnits(propertyId).then(
            (units) => {
              patchState(store, (state) => ({
                units: {
                  ...state.units,
                  [propertyId]: units
                }
              }));
            },
            (err) => {
              console.error(`Failed to load units for property ${propertyId}`, err);
            }
          );
        })
      ),

      createProperty: rxMethod<PropertyRequest>(
        switchMap((data) => {
          patchState(store, { status: LOADING, error: null });
          setWorkflow('creating', true);
          return api.createProperty(data).then(
            (property) => {
              patchState(store, (state) => ({
                properties: [...state.properties, property],
                status: SUCCESS
              }));
            },
            (err) => {
              patchState(store, { status: ERROR, error: err?.message || 'Failed to create property' });
            }
          ).finally(() => {
            setWorkflow('creating', false);
            patchState(store, { status: IDLE });
          });
        })
      ),
      
      createUnit: rxMethod<{ propertyId: string; data: UnitRequest }>(
        switchMap(({ propertyId, data }) => {
           setWorkflow('creating', true);
           return api.createUnit(propertyId, data).then(
             (unit) => {
               patchState(store, (state) => ({
                 units: {
                   ...state.units,
                   [propertyId]: [...(state.units[propertyId] || []), unit]
                 }
               }));
             },
             (err) => {
                 console.error('Failed to create unit', err);
             }
           ).finally(() => setWorkflow('creating', false));
        })
      )
    };
  })
);
