import BaseSerializer from '../BaseSerializer';
import MaterialSerializer from './MaterialSerializer';

/**
 * PointCloudMaterialSerializer
 * @param {*} app 
 */
function PointCloudMaterialSerializer(app) {
    BaseSerializer.call(this, app);
}

PointCloudMaterialSerializer.prototype = Object.create(BaseSerializer.prototype);
PointCloudMaterialSerializer.prototype.constructor = PointCloudMaterialSerializer;

PointCloudMaterialSerializer.prototype.toJSON = function (obj) {
    return MaterialSerializer.prototype.toJSON.call(this, obj);
};

PointCloudMaterialSerializer.prototype.fromJSON = function (json, parent) {
    var obj = parent === undefined ? new THREE.PointCloudMaterial() : parent;

    MaterialSerializer.prototype.fromJSON.call(this, json, obj);

    return obj;
};

export default PointCloudMaterialSerializer;