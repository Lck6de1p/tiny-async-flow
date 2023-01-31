'use strict';

let uid = 0;
class AsyncFlow {
    constructor() {
        this.flowMap = new Map();
        this.resource2UidMap = new Map();
    }
    addAsync(resources, callback) {
        if (this._isNoResources(resources))
            return this;
        resources = this._str2Arr(resources);
        uid++;
        this.flowMap.set(uid, {
            waiting: resources,
            callback,
        });
        for (const resource of resources) {
            const item = this.resource2UidMap.get(resource);
            if (item && Array.isArray(item)) {
                item.push(uid);
            }
            else {
                this.resource2UidMap.set(resource, [uid]);
            }
        }
        return this;
    }
    trigger(resources) {
        if (this._isNoResources(resources))
            return this;
        resources = this._str2Arr(resources);
        for (const resource of resources) {
            const uidArr = this.resource2UidMap.get(resource);
            if (!uidArr) {
                continue;
            }
            else {
                this._processFlowWithUid(uidArr, resource);
            }
            this.resource2UidMap.delete(resource);
        }
        return this;
    }
    _isNoResources(resources) {
        return !resources || this._isEmptyArr(resources);
    }
    _isEmptyArr(resources) {
        return Array.isArray(resources) && resources.length === 0;
    }
    _str2Arr(resources) {
        if (typeof resources === "string")
            return [resources];
        return resources;
    }
    _processFlowWithUid(uidArr, resource) {
        for (const uid of uidArr) {
            const flow = this.flowMap.get(uid);
            if (!flow) {
                continue;
            }
            else {
                this._run(uid, flow, resource);
            }
        }
    }
    _run(uid, flow, resource) {
        const index = flow.waiting.indexOf(resource);
        flow.waiting.splice(index, 1);
        if (flow.waiting.length === 0) {
            flow.callback();
            this.flowMap.delete(uid);
        }
    }
}

exports.AsyncFlow = AsyncFlow;
