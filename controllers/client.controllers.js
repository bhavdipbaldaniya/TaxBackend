const Client = require('../models/ClientProfile.model');
const { ErrorHandler, ResponseOk } = require('../services/ResponseServices');
const { ImageValidation } = require('../validation/ImageValidation');


const AddClient = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);
     const existingClient = await Client.findOne({ itin_number: req.body.itin_number });
      if (existingClient) {
        return ErrorHandler(res, 'Client already exists with this ITIN Number');
      }
  
      const file = req?.file;
      if (file) {
        const basePath = `${process.env.BACK_URL}/public/uploads/profile`;
        const imageValidationResponse = await ImageValidation(file, basePath, file.path);
        if (!imageValidationResponse) {
          return ErrorHandler(res, 'Invalid image file');
        }
        req.body.profile_photo = `${basePath}/${file.filename}`;
      }
  
      const client = new Client(req.body);
      await client.save();  
  
      if (!client) {
        return ErrorHandler(res, 'Client cannot be created');
      }
  

      console.log('Client saved',client);
      const responseData = {
        id:client._id,
        first_name: client.first_name,
        last_name: client.last_name,
        phone_number: client.phone_number,
        itin_number: client.itin_number,
        email: client.email,
        image: client.image, 
        user_id: client._id,
      };
  
      return ResponseOk(res, 'Client Added Successfully!', responseData);
  
    } catch (error) {
      console.error("Error:", error);
      return ErrorHandler(res, 'An error occurred while adding the client');
    }
};


const EditClient = async (req, res) => {
    try {
      console.log("Request body:", req.body);
      console.log("Uploaded file:", req.file);
      const client = await Client.findById(req.query.id);
      if (!client) {
        return ErrorHandler(res, 'Client not found');
      }
  
      // If ITIN number is being changed, check if it already exists (optional)
      if (req.body.itin_number && req.body.itin_number !== client.itin_number) {
        const existingClient = await Client.findOne({ itin_number: req.body.itin_number });
        if (existingClient) {
          return ErrorHandler(res, 'Client already exists with this ITIN Number');
        }
      }
  
      // If a new file is uploaded, validate and store the new image
      const file = req?.file;
      if (file) {
        const basePath = `${process.env.BACK_URL}/public/uploads/profile`;
        const imageValidationResponse = await ImageValidation(file, basePath, file.path);
        if (!imageValidationResponse) {
          return ErrorHandler(res, 'Invalid image file');
        }
        req.body.profile_photo  = `${basePath}/${file.filename}`;
      }
      console.log("mjkjk787")

      const updatedClient = await Client.findByIdAndUpdate(
        // req.params.id, 
        { _id:req.query.id },
        { $set: req.body }, 
        { new: true } 
      );
  
      if (!updatedClient) {
        return ErrorHandler(res, 'Client update failed');
      }
     console.log("dghvg")
      const responseData = {
        // id:updatedClient.id,
        first_name: updatedClient.first_name,
        last_name: updatedClient.last_name,
        phone_number: updatedClient.phone_number,
        itin_number: updatedClient.itin_number,
        email: updatedClient.email,
        image: updatedClient.image, 
        user_id: updatedClient._id,
      };
      console.log("dghvg111")

      return ResponseOk(res, 'Client edited successfully!', responseData);
  
    } catch (error) {
      console.error("Error:", error);
      return ErrorHandler(res, 'An error occurred while editing the client');
    }
};
  
  
const ActiveDeactiveClient = async (req, res) => {
    try {
      console.log("Request body:", req.body);
      
      const clientId = req.query.id;
      if (!clientId) {
        return ErrorHandler(res, 'Client ID is required');
      }
  
      const isActive = req.body.is_active;
      if (isActive !== 0 && isActive !== 1) {
        return ErrorHandler(res, 'Invalid status value. Use 0 for deactivation and 1 for activation.');
      }
  
      const client = await Client.findByIdAndUpdate(
        clientId, 
        { $set: { is_active: isActive } },
        { new: true } 
      );
  
      if (!client) {
        return ErrorHandler(res, 'Client not found');
      }
  
     
  
      return ResponseOk(res, `Client ${isActive === 1 ? 'activated' : 'deactivated'} successfully!`);
  
    } catch (error) {
      console.error("Error:", error);
      return ErrorHandler(res, 'An error occurred while updating the client status');
    }
  };
  

  module.exports = {
    AddClient,
    EditClient,
    ActiveDeactiveClient
  };