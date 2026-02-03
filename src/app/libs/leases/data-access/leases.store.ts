import { inject } from '@angular/core';
import { LeaseDetails, LeaseStatus, LeaseSummary } from './leases.models';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withMethods,
  withState,
} from '@ngrx/signals';
import { LeasesApi } from './leases.api';

export interface LeasesState {
  entities: Record<string, LeaseSummary>;
  ids: string[];

  selectedLeaseId: string | null;

  details: Record<string, LeaseDetails>;

  loading: {
    list: boolean;
    details: boolean;
    action: boolean;
  };

  error: {
    list?: string | null;
    details?: string | null;
    action?: string | null;
  };

  filters: {
    status?: LeaseStatus;
    role?: 'LANDLORD' | 'TENANT';
  };

  lastUpdated: any;
}

const initialState: LeasesState = {
  entities: {},
  ids: [],
  selectedLeaseId: null,
  details: {},

  loading: {
    list: false,
    details: false,
    action: false,
  },

  error: {},

  filters: {},
  lastUpdated: null,
};

export const LeasesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => {
    return {
      leaseList: () => store.ids().map((id) => store.entities()[id]),

      selectedLease: () => {
        const selectedLeaseId = store.selectedLeaseId();
        return selectedLeaseId ? store.details()[selectedLeaseId] : null;
      },

      filteredLeases: () => {
        const status = store.filters().status;

        if (!status) return store.ids().map((id) => store.entities()[id]);
        return store
          .ids()
          .map((id) => store.entities()[id])
          .filter((lease) => lease.status === status);
      },
    };
  }),

  withMethods((store) => {
    const api = inject(LeasesApi);
    const auth = inject(AuthStore);
    return {
      selectLease(id: string) {
        patchState(store, { selectedLeaseId: id });
      },
      clearSelection() {
        patchState(store, { selectedLeaseId: null });
      },

      async loadLeases() {
        patchState(store, {
          loading: { ...store.loading(), list: true },
          error: { ...store.error(), list: null },
        });

        try {
          const leases = await api.getLeases();

          const entities: Record<string, LeaseSummary> = {};
          const ids: string[] = [];

          for (const lease of leases) {
            entities[lease.id] = lease;
            ids.push(lease.id);
          }

          patchState(store, {
            entities,
            ids,
            loading: { ...store.loading(), list: false },
          });
        } catch (error: any) {
          patchState(store, {
            loading: { ...store.loading(), list: false },
            error: { ...store.error(), list: error.message },
          });
        }
      },
    };
  }),
);
