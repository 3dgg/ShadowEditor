import BaseComponent from '../BaseComponent';
import PerlinTerrain from '../../object/terrain/PerlinTerrain';

/**
 * 水组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function WaterComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

WaterComponent.prototype = Object.create(BaseComponent.prototype);
WaterComponent.prototype.constructor = WaterComponent;

WaterComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        id: 'perlinPanel',
        scope: this.id,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    width: '100%',
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '柏林地形'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '宽度'
            }, {
                xtype: 'int',
                id: 'width',
                scope: this.id,
                range: [0, Infinity],
                value: 1000,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '深度'
            }, {
                xtype: 'int',
                id: 'depth',
                scope: this.id,
                range: [0, Infinity],
                value: 1000,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '宽度分段'
            }, {
                xtype: 'int',
                id: 'widthSegments',
                scope: this.id,
                range: [0, Infinity],
                value: 256,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '深度分段'
            }, {
                xtype: 'int',
                id: 'depthSegments',
                scope: this.id,
                range: [0, Infinity],
                value: 256,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '质量'
            }, {
                xtype: 'int',
                id: 'quality',
                scope: this.id,
                range: [0, Infinity],
                value: 80,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

WaterComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

WaterComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

WaterComponent.prototype.updateUI = function () {
    var container = UI.get('perlinPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected instanceof PerlinTerrain) {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var width = UI.get('width', this.id);
    var depth = UI.get('depth', this.id);
    var widthSegments = UI.get('widthSegments', this.id);
    var depthSegments = UI.get('depthSegments', this.id);
    var quality = UI.get('quality', this.id);

    width.setValue(this.selected.userData.width);
    depth.setValue(this.selected.userData.depth);
    widthSegments.setValue(this.selected.userData.widthSegments);
    depthSegments.setValue(this.selected.userData.depthSegments);
    quality.setValue(this.selected.userData.quality);
};

WaterComponent.prototype.onChange = function () {
    var width = UI.get('width', this.id);
    var depth = UI.get('depth', this.id);
    var widthSegments = UI.get('widthSegments', this.id);
    var depthSegments = UI.get('depthSegments', this.id);
    var quality = UI.get('quality', this.id);

    var terrain = new PerlinTerrain(
        width.getValue(),
        depth.getValue(),
        widthSegments.getValue(),
        depthSegments.getValue(),
        quality.getValue()
    );

    var editor = this.app.editor;

    var index = editor.scene.children.indexOf(this.selected);
    if (index > -1) {
        editor.scene.children[index] = terrain;
        terrain.parent = this.selected.parent;
        this.selected.parent = null;
        this.app.call(`objectRemoved`, this, this.selected);
        this.app.call(`objectAdded`, this, terrain);
        editor.select(terrain);
        this.app.call('sceneGraphChanged', this.id);
    }
};

export default WaterComponent;