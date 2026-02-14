import { inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withState, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap } from 'rxjs';
import { LeasesApi } from './leases.api';
import { LeaseDetails, LeaseRequest } from './leases.models';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

export type LeaseStatusState = 'idle' | 'loading' | 'success' | 'error';

export interface LeasesState {
  entities: Record<string, LeaseDetails>;
  currentLeaseId: string | null;

  status: LeaseStatusState;
  error: string | null;

  workflow: {
    accepting: boolean;
    terminating: boolean;
    creating: boolean;
    fetching: boolean;
  };
}

const IDLE = 'idle' as const;
const LOADING = 'loading' as const;
const SUCCESS = 'success' as const;
const ERROR = 'error' as const;

export const LeasesStore = signalStore(
  { providedIn: 'root' },
  withDevtools('leases'),
  withState<LeasesState>({
    entities: {},
    currentLeaseId: null,
    status: IDLE,
    error: null,
    workflow: {
      accepting: false,
      terminating: false,
      creating: false,
      fetching: false,
    },
  }),

  withComputed((store) => ({
    currentLease: () => {
      const id = store.currentLeaseId();
      return id ? (store.entities()[id] ?? null) : null;
    },

    isBusy: () => {
      const w = store.workflow();
      return w.accepting || w.terminating || w.creating || w.fetching;
    },
  })),

  withMethods((store) => {
    const api = inject(LeasesApi);

    function setWorkflow<K extends keyof LeasesState['workflow']>(key: K, value: boolean) {
      patchState(store, (state) => ({
        workflow: {
          ...state.workflow,
          [key]: value,
        },
      }));
    }

    function upsertLease(lease: LeaseDetails) {
      patchState(store, (state) => ({
        entities: {
          ...state.entities,
          [lease.lease.id]: lease,
        },
        currentLeaseId: lease.lease.id,
      }));
    }

    return {
      loadLeaseById: rxMethod<string>(
        switchMap((leaseId) => {
          patchState(store, {
            status: LOADING,
            error: null,
          });
          setWorkflow('fetching', true);

          return api
            .getLeaseById(leaseId)
            .then(
              (lease) => {
                upsertLease(lease);
                patchState(store, { status: SUCCESS });
              },
              (err) => {
                patchState(store, {
                  status: ERROR,
                  error: err?.message || 'Failed to load lease',
                });
              },
            )
            .finally(() => {
              setWorkflow('fetching', false);
              patchState(store, { status: IDLE });
            });
        }),
      ),

      loadAllLeases: rxMethod<void>(
        switchMap(() => {
          patchState(store, {
            status: LOADING,
            error: null,
          });
          setWorkflow('fetching', true);

          return api
            .getAllLeases()
            .then(
              (leases) => {
                const entities = leases.reduce(
                  (acc, curr) => ({ ...acc, [curr.lease.id]: curr }),
                  {},
                );
                patchState(store, (state) => ({
                  entities: { ...state.entities, ...entities },
                  status: SUCCESS,
                }));
              },
              (err) => {
                patchState(store, {
                  status: ERROR,
                  error: err?.message || 'Failed to load all leases',
                });
              },
            )
            .finally(() => {
              setWorkflow('fetching', false);
              patchState(store, { status: IDLE });
            });
        }),
      ),

      acceptAsTenant: rxMethod<string>(
        switchMap((leaseId) => {
          patchState(store, {
            status: LOADING,
            error: null,
          });
          setWorkflow('accepting', true);

          return api
            .acceptAsTenant(leaseId)
            .then(
              (lease) => {
                upsertLease(lease);
                patchState(store, { status: SUCCESS });
              },
              (err) => {
                patchState(store, {
                  status: ERROR,
                  error: err?.message || 'Failed to accept lease',
                });
              },
            )
            .finally(() => {
              setWorkflow('accepting', false);
              patchState(store, { status: IDLE });
            });
        }),
      ),

      acceptAsLandlord: rxMethod<string>(
        switchMap((leaseId) => {
          patchState(store, {
            status: LOADING,
            error: null,
          });
          setWorkflow('accepting', true);

          return api
            .acceptAsLandlord(leaseId)
            .then(
              (lease) => {
                upsertLease(lease);
                patchState(store, { status: SUCCESS });
              },
              (err) => {
                patchState(store, {
                  status: ERROR,
                  error: err?.message || 'Failed to accept lease',
                });
              },
            )
            .finally(() => {
              setWorkflow('accepting', false);
              patchState(store, { status: IDLE });
            });
        }),
      ),

      createLease: rxMethod<LeaseRequest>(
        switchMap((request) => {
          patchState(store, {
            status: LOADING,
            error: null,
          });
          setWorkflow('creating', true);

          return api
            .createLease(request)
            .then(
              (lease) => {
                upsertLease(lease);
                patchState(store, { status: SUCCESS });
              },
              (err) => {
                patchState(store, {
                  status: ERROR,
                  error: err?.message || 'Failed to create lease',
                });
              },
            )
            .finally(() => {
              setWorkflow('creating', false);
              patchState(store, { status: IDLE });
            });
        }),
      ),

      terminateLease: rxMethod<string>(
        switchMap((leaseId) => {
          patchState(store, {
            status: LOADING,
            error: null,
          });
          setWorkflow('terminating', true);

          return api
            .terminateLease(leaseId)
            .then(
              (lease) => {
                upsertLease(lease);
                patchState(store, { status: SUCCESS });
              },
              (err) => {
                patchState(store, {
                  status: ERROR,
                  error: err?.message || 'Failed to terminate lease',
                });
              },
            )
            .finally(() => {
              setWorkflow('terminating', false);
              patchState(store, { status: IDLE });
            });
        }),
      ),

      resetCurrentLease: () => {
        patchState(store, { currentLeaseId: null });
      },
    };
  }),
);
