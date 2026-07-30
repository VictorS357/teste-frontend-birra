const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const File = sequelize.define(
        'File',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                field: 'id'
            },

            path: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'path'
            },

            file: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'file'
            },

            createTime: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'create_time'
            },

            lastModifiedBy: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'last_modified_by'
            },
            mimeType: {
                type: DataTypes.STRING,
                allowNull: true,
                field: 'mime_type'
            }
        },
        {
            tableName: 'files',
            timestamps: false
        }
    );

    return File;
};