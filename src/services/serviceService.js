// Service data service for handling CRUD operations with the Apper backend
export const ServiceDataService = {
  // Fetch all services
  fetchServices: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: [
          { Field: { Name: "Id" } },
          { Field: { Name: "Name" } },
          { Field: { Name: "title" } },
          { Field: { Name: "description" } },
          { Field: { Name: "icon" } }
        ]
      };

      const response = await apperClient.fetchRecords('service', params);
      return response;
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  },

  // Get a single service by ID
  getServiceById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: [
          { Field: { Name: "Id" } },
          { Field: { Name: "Name" } },
          { Field: { Name: "title" } },
          { Field: { Name: "description" } },
          { Field: { Name: "icon" } }
        ]
      };

      const response = await apperClient.getRecordById('service', id, params);
      return response;
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new service
  createService: async (serviceData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [serviceData]
      };

      const response = await apperClient.createRecord('service', params);
      return response;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  },

  // Update an existing service
  updateService: async (id, serviceData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          ...serviceData
        }]
      };

      const response = await apperClient.updateRecord('service', params);
      return response;
    } catch (error) {
      console.error(`Error updating service with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a service
  deleteService: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('service', params);
      return response;
    } catch (error) {
      console.error(`Error deleting service with ID ${id}:`, error);
      throw error;
    }
  }
};