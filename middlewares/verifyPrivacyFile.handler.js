const { sequelize } = require('./../libs/sequelize');
const express = require('express');
const { tokenVerify } = require('./../libs/token-verify');
const { superAdmin } = require('./auth.handler');
const authCombined = require('./authCombined.handler');


const verifyPrivacyFile = () => async (req, res, next) => {
    try {
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const imageInfo = await sequelize.models.FilesRegistration.findOne({
            where: { url: fullUrl }
        });

        if (!imageInfo) {
            throw('error')
        }

        if (!imageInfo.isPublic) {
            const token = req.headers.authorization;
            if(!token){
                throw('error')
            }
            const authCombinedMiddleware = (req, res) => {
                return new Promise((resolve, reject) => {
                    authCombined('access')(req, res, (error) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve()
                        }
                    })
                });
            }
            await authCombinedMiddleware(req, res);
            const informationUser = req.user ? req.user : null;
            if (informationUser && informationUser.id !== imageInfo.userId) {
                if(!superAdmin.includes(informationUser.role)){
                    throw('error')
                }
            }
        }
        express.static('uploads')(req, res, next);
    } catch (error) {
        return res.status(403).json()
    }
};


module.exports = verifyPrivacyFile;