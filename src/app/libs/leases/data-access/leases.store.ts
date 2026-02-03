import { inject } from '@angular/core';
import { LeaseDetails, LeaseRequest } from './leases.models';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { LeasesApi } from './leases.api';
import { switchMap } from 'rxjs';
export interface LeasesState {
  entities: Record<string, LeaseDetails>;
  currentLeaseId: string | null;

  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;

  workflow: {
    accepting: boolean;
    terminating: boolean;
    creating: boolean;
    fetching: boolean;
  };
}

export const LeasesStore = signalStore(
  { providedIn: 'root' },
  withState<LeasesState>({
    entities: {},
    currentLeaseId: null,
    status: 'idle',
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
      return id ? store.entities()[id] : null;
    },

    isbusy: () =>
      store.workflow().accepting || store.workflow().terminating || store.workflow().creating,
  })),
  withMethods((store) => {
    const api = inject(LeasesApi);

    return {
      loadLeaseById: rxMethod<string>(
        switchMap((leaseId) => {
          patchState(store, {
            status: 'loading',
            error: null,
            workflow: { ...store.workflow(), fetching: true },
          });

          return api
            .getLeaseById(leaseId)
            .then(
              (lease) => {
                patchState(store, (state) => ({
                  entities: { ...state.entities, [lease.lease.id]: lease },
                  currentLeaseId: lease.lease.id,
                  status: 'success' as const,
                }));
              },
              (error) => {
                patchState(store, {
                  status: 'error',
                  error: error?.message || 'Failed to load lease',
                  workflow: { ...store.workflow(), fetching: false },
                });
              },
            )
            .finally(() => {
              patchState(store, {
                status: 'idle',
                workflow: { ...store.workflow(), fetching: false },
              });
            });
        }),
      ),

      acceptAsTenant: rxMethod<string>(
        switchMap((leaseId) => {
          patchState(store, {
            status: 'loading',
            error: null,
            workflow: { ...store.workflow(), accepting: true },
          });
          return api
            .acceptAsTenant(leaseId)
            .then(
              (lease) => {
                patchState(store, (state) => ({
                  entities: { ...state.entities, [lease.lease.id]: lease },
                }));
              },
              (error) => {
                patchState(store, {
                  status: 'error',
                  error: error?.message || 'Failed to accept lease',
                  workflow: { ...store.workflow(), accepting: false },
                });
              },
            )
            .finally(() => {
              patchState(store, {
                status: 'idle',
                workflow: { ...store.workflow(), accepting: false },
              });
            });
        }),
      ),

      acceptAsLandlord: rxMethod<string>(
        switchMap((leaseId) => {
          patchState(store, {
            status: 'loading',
            error: null,
            workflow: { ...store.workflow(), accepting: true },
          });

          return api
            .acceptAsLandlord(leaseId)
            .then(
              (lease) => {
                patchState(store, (state) => ({
                  entities: { ...state.entities, [lease.lease.id]: lease },
                }));
              },
              (error) => {
                patchState(store, {
                  status: 'error',
                  error: error?.message || 'Failed to accept lease',
                });
              },
            )
            .finally(() => {
              patchState(store, {
                status: 'idle',
                workflow: { ...store.workflow(), accepting: false },
              });
            });
        }),
      ),

      createLease: rxMethod<LeaseRequest>(
        switchMap((leaseRequest) => {
          patchState(store, {
            status: 'loading',
            error: null,
            workflow: { ...store.workflow(), creating: true },
          });

          return api
            .createLease(leaseRequest)
            .then(
              (lease) => {
                patchState(store, (state) => ({
                  entities: { ...state.entities, [lease.lease.id]: lease },
                  currentLeaseId: lease.lease.id,
                  workflow: { ...state.workflow, creating: false },
                }));
              },
              (error) => {
                patchState(store, {
                  status: 'error',
                  error: error?.message || 'Failed to create lease',
                  workflow: { ...store.workflow(), creating: false },
                });
              },
            )
            .finally(() => {
              patchState(store, {
                status: 'idle',
                workflow: { ...store.workflow(), creating: false },
              });
            });
        }),
      ),

      terminateLease: rxMethod<string>(
        switchMap((leaseId) => {
          patchState(store, { workflow: { ...store.workflow(), terminating: true } });
          return api
            .terminateLease(leaseId)
            .then(
              (lease) => {
                patchState(store, (state) => ({
                  entities: { ...state.entities, [lease.lease.id]: lease },
                }));
              },
              (error) => {
                patchState(store, {
                  status: 'error',
                  error: error?.message || 'Failed to terminate lease',
                  workflow: { ...store.workflow(), terminating: false },
                });
              },
            )
            .finally(() => {
              patchState(store, {
                workflow: { ...store.workflow(), terminating: false },
              });
            });
        }),
      ),
    };
  }),
);
