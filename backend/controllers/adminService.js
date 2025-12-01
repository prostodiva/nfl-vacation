/**
 * @fileoverview Admin service controller - Handles admin authentication and data import
 * @module adminService
 */

const Admin = require('../models/Admin');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const fs = require('fs');
const execPromise = util.promisify(exec);

/**
 * Create admin account
 * Creates a new admin user in the database
 * 
 * @param {string} email - Admin email address
 * @param {string} password - Admin password (stored as plain text - not recommended for production)
 * @returns {Promise<Object>} Created admin object
 * @throws {Error} If admin creation fails
 * @private
 */
const createAdmin = async (email, password) => {
    try {
        const admin = await Admin.create({ email, password });
        return admin;
    } catch (error) {
        throw error;
    }
};

/**
 * Login admin
 * Authenticates an admin user by email and password
 * 
 * @param {string} email - Admin email address
 * @param {string} password - Admin password
 * @returns {Promise<Object|null>} Admin object with id and email, or null if invalid
 * @throws {Error} If login fails
 * @private
 */
const loginAdmin = async (email, password) => {
    try {
        const admin = await Admin.findOne({ email });
        if (admin && admin.password === password) {
            return { id: admin._id, email: admin.email };
        }
        return null;
    } catch (error) {
        throw error;
    }
};

/**
 * Import data from Excel file
 * Imports teams, distances, or souvenirs from uploaded Excel file
 * Automatically detects import type from filename
 * 
 * @route POST /api/admin/import
 * @access Private (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} req.file - Uploaded file (multer)
 * @param {string} req.file.originalname - Original filename (must be 'teams-stadiums.xlsx', 'stadium-distances.xlsx', or 'souvenirs.xlsx')
 * @param {string} req.file.path - Temporary file path
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status, message, and import count
 * @example
 * // Request: POST /api/admin/import
 * // FormData with file: teams-stadiums.xlsx
 * // Response:
 * {
 *   success: true,
 *   message: 'Successfully imported teams from Excel',
 *   importedCount: 32,
 *   type: 'teams'
 * }
 */
const importFromExcel = async (req, res) => {
    let uploadedFilePath = null;
    let targetFilePath = null;
    
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        uploadedFilePath = req.file.path;
        const filename = req.file.originalname.toLowerCase();
        
        // Determine import type from filename
        let importType;
        let scriptName;
        
        if (filename.includes('teams-stadiums') || filename === 'teams-stadiums.xlsx') {
            importType = 'teams';
            scriptName = 'import_teams.py';
        } else if (filename.includes('stadium-distances') || filename === 'stadium-distances.xlsx') {
            importType = 'distances';
            scriptName = 'import_distances.py';
        } else if (filename.includes('souvenirs') || filename === 'souvenirs.xlsx') {
            importType = 'souvenirs';
            scriptName = 'import_souvenirs.py';
        } else {
            // Clean up uploaded file
            fs.unlinkSync(uploadedFilePath);
            return res.status(400).json({
                success: false,
                message: 'Invalid filename. File must be named "teams-stadiums.xlsx", "stadium-distances.xlsx", or "souvenirs.xlsx"'
            });
        }

        // Path to the Python script and virtual environment
        const scriptsDir = path.join(__dirname, '..', 'scripts');
        const scriptPath = path.join(scriptsDir, scriptName);
        const venvPython = path.join(scriptsDir, 'venv', 'bin', 'python3');
        
        // Check if venv Python exists, fallback to system python3
        let pythonCommand = 'python3';
        if (fs.existsSync(venvPython)) {
            pythonCommand = `"${venvPython}"`;
        }
        
        // Copy uploaded file to scripts directory (Python script expects it there)
        targetFilePath = path.join(scriptsDir, filename);
        fs.copyFileSync(uploadedFilePath, targetFilePath);
        
        // Execute Python script with file path as argument
        const command = `cd "${scriptsDir}" && ${pythonCommand} "${scriptPath}" "${targetFilePath}"`;
        console.log('Executing command:', command);
        
        const { stdout, stderr } = await execPromise(
            command,
            { maxBuffer: 1024 * 1024 * 10 } // 10MB buffer
        );

        // Clean up uploaded file
        if (fs.existsSync(uploadedFilePath)) {
            fs.unlinkSync(uploadedFilePath);
        }
        
        // Clean up copied file in scripts directory
        if (targetFilePath && fs.existsSync(targetFilePath)) {
            fs.unlinkSync(targetFilePath);
        }

        if (stderr && !stderr.includes('Warning') && stderr.trim()) {
            console.error('Python script stderr:', stderr);
            return res.status(500).json({
                success: false,
                message: `Error importing ${importType} from Excel`,
                error: stderr
            });
        }

        // Extract count from stdout if available
        const countMatch = stdout.match(/(\d+)\s+(teams|distances|records|souvenirs)/i);
        const importedCount = countMatch ? parseInt(countMatch[1]) : null;

        res.status(200).json({
            success: true,
            message: `Successfully imported ${importType} from Excel`,
            output: stdout,
            importedCount: importedCount,
            type: importType
        });
    } catch (error) {
        // Clean up uploaded file on error
        if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
            try {
                fs.unlinkSync(uploadedFilePath);
            } catch (cleanupError) {
                console.error('Error cleaning up uploaded file:', cleanupError);
            }
        }
        
        // Clean up copied file on error
        if (targetFilePath && fs.existsSync(targetFilePath)) {
            try {
                fs.unlinkSync(targetFilePath);
            } catch (cleanupError) {
                console.error('Error cleaning up copied file:', cleanupError);
            }
        }
        
        console.error('Import error:', error);
        res.status(500).json({
            success: false,
            message: `Error importing from Excel`,
            error: error.message,
            stderr: error.stderr || ''
        });
    }
};

module.exports = { createAdmin, loginAdmin, importFromExcel };


