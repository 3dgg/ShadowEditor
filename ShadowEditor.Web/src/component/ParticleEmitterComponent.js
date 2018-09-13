import BaseComponent from './BaseComponent';
import SetValueCommand from '../command/SetValueCommand';

/**
 * 粒子发射器组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function ParticleEmitterComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

ParticleEmitterComponent.prototype = Object.create(BaseComponent.prototype);
ParticleEmitterComponent.prototype.constructor = ParticleEmitterComponent;

ParticleEmitterComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'particleEmitterPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold'
                },
                text: '粒子发射'
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '位置'
                }, {
                    xtype: 'number',
                    id: 'positionX',
                    scope: this.id,
                }, {
                    xtype: 'number',
                    id: 'positionY',
                    scope: this.id,
                }, {
                    xtype: 'number',
                    id: 'positionZ',
                    scope: this.id,
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '位置发散'
                }, {
                    xtype: 'number',
                    id: 'positionSpreadX',
                    scope: this.id,
                }, {
                    xtype: 'number',
                    id: 'positionSpreadY',
                    scope: this.id,
                }, {
                    xtype: 'number',
                    id: 'positionSpreadZ',
                    scope: this.id,
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '速度'
                }, {
                    xtype: 'number',
                    id: 'velocityX',
                    scope: this.id,
                }, {
                    xtype: 'number',
                    id: 'velocityY',
                    scope: this.id,
                }, {
                    xtype: 'number',
                    id: 'velocityZ',
                    scope: this.id,
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '速度发散'
                }, {
                    xtype: 'number',
                    id: 'velocitySpreadX',
                    scope: this.id,
                }, {
                    xtype: 'number',
                    id: 'velocitySpreadY',
                    scope: this.id,
                }, {
                    xtype: 'number',
                    id: 'velocitySpreadZ',
                    scope: this.id,
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '加速度'
                }, {
                    xtype: 'number',
                    id: 'accelerationX',
                    scope: this.id,
                }, {
                    xtype: 'number',
                    id: 'accelerationY',
                    scope: this.id,
                }, {
                    xtype: 'number',
                    id: 'accelerationZ',
                    scope: this.id,
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '加速度发散'
                }, {
                    xtype: 'number',
                    id: 'accelerationSpreadX',
                    scope: this.id,
                }, {
                    xtype: 'number',
                    id: 'accelerationSpreadY',
                    scope: this.id,
                }, {
                    xtype: 'number',
                    id: 'accelerationSpreadZ',
                    scope: this.id,
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '颜色'
                }, {
                    xtype: 'color',
                    id: 'color',
                    scope: this.id,
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '尺寸'
                }, {
                    xtype: 'number',
                    id: 'size',
                    scope: this.id,
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '纹理'
                }, {
                    xtype: 'texture',
                    id: 'texture',
                    scope: this.id
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '粒子数量'
                }, {
                    xtype: 'int',
                    range: [1, Infinity],
                    id: 'particleCount',
                    scope: this.id,
                }]
            }, {
                xtype: 'row',
                children: [{
                    xtype: 'label',
                    text: '持续时长'
                }, {
                    xtype: 'number',
                    id: 'maxAge',
                    scope: this.id,
                }]
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

ParticleEmitterComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

ParticleEmitterComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

ParticleEmitterComponent.prototype.updateUI = function () {
    var container = UI.get('particleEmitterPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected.userData.type === 'ParticleEmitter') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;
};

export default ParticleEmitterComponent;