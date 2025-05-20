const { sequelize } = require('./../libs/sequelize');
const express = require('express');
const boom = require('@hapi/boom');
const { superAdmin } = require('./auth.handler');
const authCombined = require('./authCombined.handler');


const verifyPrivacyFile = () => async (req, res, next) => {
    try {
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const imageInfo = await sequelize.models.FilesRegistration.findOne({
            where: { url: decodeURIComponent(fullUrl) }
        });

        if (!imageInfo) {
            throw res.status(404).json()
        }

        if (!imageInfo.isPublic) {
            const token = req.headers.authorization;
            if(!token){
                throw res.status(403).json()
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
                    throw res.status(403).json()
                }
            }
        }
        express.static('uploads')(req, res, next);
    } catch (error) {
        return error
    }
};


module.exports = verifyPrivacyFile;