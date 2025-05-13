// Appointment service for handling CRUD operations with the Apper backend
export const AppointmentService = {
  // Fetch all appointments with optional filtering
  fetchAppointments: async (filters = {}) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Build query parameters
      const params = {
        Fields: [
          { Field: { Name: "Id" } },
          { Field: { Name: "Name" } },
          { Field: { Name: "fullName" } },
          { Field: { Name: "email" } },
          { Field: { Name: "phone" } },
          { Field: { Name: "doctor" } },
          { Field: { Name: "appointmentType" } },
          { Field: { Name: "notes" } },
          { Field: { Name: "date" } },
          { Field: { Name: "time" } },
          { Field: { Name: "status" } },
        ]
      };

      // Add filters if provided
      if (filters.status) {
        params.where = [
          {
            fieldName: "status",
            Operator: "ExactMatch",
            values: [filters.status]
          }
        ];
      }

      // Add pagination
      if (filters.limit) {
        params.pagingInfo = {
          limit: filters.limit,
          offset: filters.offset || 0
        };
      }

      const response = await apperClient.fetchRecords('appointment', params);
      return response;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  },

  // Get a single appointment by ID
  getAppointmentById: async (id) => {
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
          { Field: { Name: "fullName" } },
          { Field: { Name: "email" } },
          { Field: { Name: "phone" } },
          { Field: { Name: "doctor" } },
          { Field: { Name: "appointmentType" } },
          { Field: { Name: "notes" } },
          { Field: { Name: "date" } },
          { Field: { Name: "time" } },
          { Field: { Name: "status" } }
        ]
      };

      const response = await apperClient.getRecordById('appointment', id, params);
      return response;
    } catch (error) {
      console.error(`Error fetching appointment with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new appointment
  createAppointment: async (appointmentData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Set default status if not provided
      if (!appointmentData.status) {
        appointmentData.status = "Scheduled";
      }

      const params = {
        records: [appointmentData]
      };

      const response = await apperClient.createRecord('appointment', params);
      return response;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },

  // Update an existing appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          ...appointmentData
        }]
      };

      const response = await apperClient.updateRecord('appointment', params);
      return response;
    } catch (error) {
      console.error(`Error updating appointment with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete an appointment
  deleteAppointment: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('appointment', params);
      return response;
    } catch (error) {
      console.error(`Error deleting appointment with ID ${id}:`, error);
      throw error;
    }
  }
};