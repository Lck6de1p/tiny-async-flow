interface Flow {
  waiting: string[];
  callback: () => void;
}

type Resources = string | string[];

let uid = 0;

export class AsyncFlow {
  flowMap: Map<number, Flow>;
  resource2UidMap: Map<string, number[]>;
  constructor() {
    this.flowMap = new Map();
    this.resource2UidMap = new Map();
  }
  addAsync(resources: Resources, callback: () => void) {
    if (this._isNoResources(resources)) return this;
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
      } else {
        this.resource2UidMap.set(resource, [uid]);
      }
    }
    return this;
  }
  trigger(resources: Resources) {
    if (this._isNoResources(resources)) return this;
    resources = this._str2Arr(resources);
    for (const resource of resources) {
      const uidArr = this.resource2UidMap.get(resource);
      if (!uidArr) {
        continue;
      } else {
        this._processFlowWithUid(uidArr, resource);
      }
      this.resource2UidMap.delete(resource);
    }
    return this;
  }
  _isNoResources(resources: Resources) {
    return !resources || this._isEmptyArr(resources);
  }
  _isEmptyArr(resources: Resources) {
    return Array.isArray(resources) && resources.length === 0;
  }
  _str2Arr(resources: Resources) {
    if (typeof resources === "string") return [resources];
    return resources;
  }
  _processFlowWithUid(uidArr: number[], resource: string) {
    for (const uid of uidArr) {
      const flow = this.flowMap.get(uid);
      if (!flow) {
        continue;
      } else {
        this._run(uid, flow, resource);
      }
    }
  }
  _run(uid: number, flow: Flow, resource: string) {
    const index = flow.waiting.indexOf(resource);
    flow.waiting.splice(index, 1);
    if (flow.waiting.length === 0) {
      flow.callback();
      this.flowMap.delete(uid);
    }
  }
}
