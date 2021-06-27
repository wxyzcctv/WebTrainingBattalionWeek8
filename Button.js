import { Component, STATE, ATTRIBUTE, createElement } from "./framewok.js";
import { enableGesture } from "./gesture/gesture.js";

export { STATE, ATTRIBUTE } from './framewok.js'

export class Button extends Component {
    constructor() {
        super();
    }
    render() {
        this.childContainer = <span />;
        this.root = (<div>{this.childContainer}</div>).render();
        return this.root;
    }

    appendChild(child) {
        if (!this.childContainer) {
            this.render()
        }
        this.childContainer.appendChild(child);
    }
}