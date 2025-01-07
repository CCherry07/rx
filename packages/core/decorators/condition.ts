import { effect } from "alien-signals";
import { Decision } from "../boolless";
import { Field } from "../controls/field";
import { METADATA_CONDITIONS } from "./metaKeys";

export function Condition(decision: Decision): Function {
  return function (method: any, ctx: ClassMethodDecoratorContext) {
    (ctx.metadata![METADATA_CONDITIONS] ??= {} as any)[ctx.name] = function (this: Field) {
      return effect(() => {
        if (this.evaluateDecision(decision)) {
          method.call(this);
        }
      });
    }
  };
}
