import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';


export const useReportStore = defineStore('report', {
  state: () => ({}),
  getters: {},
  actions: {
    async retrieveDaily(reportInfo) {
      try {
        const start_date = reportInfo.start_date;
        const end_date = reportInfo.end_date;
        let branches = '';
        reportInfo.branches.forEach((b) => {
          branches += `&branch_ids=${b}`;
        });
        const reportType = reportInfo.reportType;
        const transaction = reportInfo.transaction;
        const response_type = reportInfo.response_type || 'view';
        const filter = reportInfo.filter || '';
        const response = await api.get(`/api/reports/daily${reportType === 'detailed' ? '-detailed' : ''}-report/?start_date=${start_date}&end_date=${end_date}&transaction=${transaction}${branches}&filter=${filter}&response_type=${response_type}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async retrieveSales(reportInfo) {
      try {
        const start_date = reportInfo.start_date;
        const end_date = reportInfo.end_date;
        let branches = '';
        reportInfo.branches.forEach((b) => {
          branches += `&branch_ids=${b}`;
        });
        const filter = reportInfo.filter || '';
        const response_type = reportInfo.response_type || 'view';
        console.log(`/api/reports/sales-report/?start_date=${start_date}&end_date=${end_date}${branches}&filter=${filter}&response_type=${response_type}`);
        const response = await api.get(`/api/reports/sales-report/?start_date=${start_date}&end_date=${end_date}${branches}&filter=${filter}&response_type=${response_type}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async retrieveInventory(reportInfo) {
      try {
        const start_date = reportInfo.start_date;
        const end_date = reportInfo.end_date;
        const out_stock = reportInfo.out_stock;
        let branches = '';
        reportInfo.branches.forEach((b) => {
          branches += `&branch_ids=${b}`;
        });
        const filter = reportInfo.filter || '';
        const response_type = reportInfo.response_type || 'view';
        const response = await api.get(`/api/reports/inventory-report/?start_date=${start_date}&end_date=${end_date}&out_stock=${out_stock}${branches}&filter=${filter}&response_type=${response_type}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async retrieveSalesSummary(reportInfo) {
      try {
        const start_date = reportInfo.start_date;
        const end_date = reportInfo.end_date;
        let branches = '';
        reportInfo.branches.forEach((b) => {
          branches += `&branch_ids=${b}`;
        });
        const filter = reportInfo.filter || '';
        const response_type = reportInfo.response_type || 'view';
        const response = await api.get(`/api/reports/sales-summary-report/?start_date=${start_date}&end_date=${end_date}${branches}&filter=${filter}&response_type=${response_type}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async retrieveCurrency(reportInfo) {
      try {
        const start_date = reportInfo.start_date;
        const end_date = reportInfo.end_date;
        let branches = '';
        reportInfo.branches.forEach((b) => {
          branches += `&branch_ids=${b}`;
        });
        const transaction = reportInfo.transaction;
        const filter = reportInfo.filter || '';
        const response_type = reportInfo.response_type || 'view';
        const response = await api.get(`/api/reports/daily-currency-report/?start_date=${start_date}&end_date=${end_date}&transaction=${transaction}${branches}&filter=${filter}&response_type=${response_type}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async retrieveCredit(reportInfo) {
      try {
        const start_date = reportInfo.start_date;
        const end_date = reportInfo.end_date;
        const vendor = reportInfo.vendor;
        const response_type = reportInfo.response_type || 'view';
        const report_type = reportInfo.report_type;
        const branch = reportInfo.branch;
        const response = await api.get(`/api/reports/credit-report/?start_date=${start_date}&end_date=${end_date}&vendor=${vendor}&response_type=${response_type}&report_type=${report_type}&branch=${branch}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async retrieveDebit(reportInfo) {
      try {
        const start_date = reportInfo.start_date;
        const end_date = reportInfo.end_date;
        const customer = reportInfo.customer;
        const response_type = reportInfo.response_type || 'view';
        const report_type = reportInfo.report_type;
        const branch = reportInfo.branch;
        const response = await api.get(`/api/reports/debit-report/?start_date=${start_date}&end_date=${end_date}&customer=${customer}&response_type=${response_type}&report_type=${report_type}&branch=${branch}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    async retrieveProductMonitor(reportInfo) {
      try {
        const start_date = reportInfo.start_date;
        const end_date = reportInfo.end_date;
        let branches = '';
        console.log('branches', reportInfo.branches);
        reportInfo.branches.forEach((b) => {
          if (b > 0) {
            branches += `&branch_ids=${b}`;
          }
        });
        console.log('branches', branches);
        const product_id = reportInfo.product_id;
        const filter = reportInfo.filter || '';
        const response_type = reportInfo.response_type || 'view';
        const response = await api.get(`/api/reports/product-monitor/?start_date=${start_date}&end_date=${end_date}&product_id=${product_id}${branches}&filter=${filter}&response_type=${response_type}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },

});
