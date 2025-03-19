const energyService = require('../Services/LiveEnergy');
const express = require('express');
const router = express.Router();

//just returns 2 values
router.get('/api/energyGrid', (req, res) => {
    try {
        const energyCost = energyService.getEnergyCost();
        const carbonIntensity = energyService.getCarbonIntensity();

        if (energyCost === null || carbonIntensity === null) {
            return res.status(503).json({ 
                success: false, 
                message: 'energyGrid down Please try again later.' 
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Grid energy data retrieved successfully',
            energyCost,         //GBP per kWh
            carbonIntensity     // just actual values
        });
    } catch (error) {
        console.error('Error in /api/energyGrid:', error);
        return res.status(500).json({ success: false, message: 'internal server error' });
    }
});
module.exports = router;