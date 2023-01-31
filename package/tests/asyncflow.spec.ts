import { AsyncFlow } from "..";
describe("AsyncFlow", () => {
  const asyncFlow = new AsyncFlow();
  let isTriggerAB = false;
  let isTriggerB = false;
  test("addAsync nothings", () => {
    asyncFlow.addAsync([], function () {
      console.log("nothing");
    });
    asyncFlow.addAsync("", function () {
      console.log("nothing");
    });
    console.log(asyncFlow);
    expect(asyncFlow.flowMap.size).toBe(0);
    expect(asyncFlow.resource2UidMap.size).toBe(0);
  });

  test("callback trigger", () => {
    const mockFn = jest.fn();
    asyncFlow.addAsync(["fn"], function () {
      mockFn();
    });
    expect(mockFn).toHaveBeenCalledTimes(0);

    asyncFlow.trigger("fn");
    expect(mockFn).toHaveBeenCalled();
  });

  test("addAsync a & b", () => {
    asyncFlow.addAsync(["a", "b"], function () {
      console.log("callback after trigger a & b.");
      isTriggerAB = true;
    });
    {
      expect(asyncFlow.flowMap.size).toBe(1);
      expect(asyncFlow.resource2UidMap.size).toBe(2);
      const aDeps = asyncFlow.resource2UidMap.get("a") || [];
      expect(aDeps.length).toBe(1);
      const bDeps = asyncFlow.resource2UidMap.get("b") || [];
      expect(bDeps.length).toBe(1);
      expect(isTriggerAB).toBeFalsy;
    }
  });
  test("addAsync b", () => {
    asyncFlow.addAsync(["b"], function () {
      console.log("callback after trigger b.");
      isTriggerB = true;
    });
    expect(asyncFlow.flowMap.size).toBe(2);
    expect(asyncFlow.resource2UidMap.size).toBe(2);
    const aDeps = asyncFlow.resource2UidMap.get("a") || [];
    expect(aDeps.length).toBe(1);
    const bDeps = asyncFlow.resource2UidMap.get("b") || [];
    expect(bDeps.length).toBe(2);
    expect(isTriggerB).toBeFalsy;
  });

  test("trigger nonexistent flow", () => {
    asyncFlow.trigger("d");
    expect(asyncFlow.flowMap.size).toBe(2);
    expect(asyncFlow.resource2UidMap.size).toBe(2);
    const aDeps = asyncFlow.resource2UidMap.get("a") || [];
    expect(aDeps.length).toBe(1);
    const bDeps = asyncFlow.resource2UidMap.get("b") || [];
    expect(bDeps.length).toBe(2);
    expect(isTriggerAB).toBeFalsy;
    expect(isTriggerB).toBeFalsy;
  });
  test("trigger a", () => {
    asyncFlow.trigger("a");
    expect(asyncFlow.flowMap.size).toBe(2);
    expect(asyncFlow.resource2UidMap.size).toBe(1);
    const aDeps = asyncFlow.resource2UidMap.get("a") || [];
    expect(aDeps.length).toBe(0);
    const bDeps = asyncFlow.resource2UidMap.get("b") || [];
    expect(bDeps.length).toBe(2);
    expect(isTriggerAB).toBeFalsy;
    expect(isTriggerB).toBeFalsy;
  });
  test("trigger b", () => {
    asyncFlow.trigger("b");
    expect(asyncFlow.flowMap.size).toBe(0);
    expect(asyncFlow.resource2UidMap.size).toBe(0);
    const aDeps = asyncFlow.resource2UidMap.get("a") || [];
    expect(aDeps.length).toBe(0);
    const bDeps = asyncFlow.resource2UidMap.get("b") || [];
    expect(bDeps.length).toBe(0);
    expect(isTriggerAB).toBeTruthy;
    expect(isTriggerB).toBeTruthy;
  });
});
