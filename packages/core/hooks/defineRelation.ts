import type { FieldBuilder } from "../builder/field";
import { Effect, isArray, isFunction } from "alien-deepsignals"

export type Relation = [
  deps: string | string[] | ((field: FieldBuilder) => void),
  cb: (this: FieldBuilder, depValues: any) => void
]
export function createRelation([deps, cb]: Relation) {
  return function (this: FieldBuilder) {
    let field = this
    const getter = isFunction(deps) ? deps.bind(null, field) : () => this.getAbstractModel().getFieldValues(deps)
    const effect = new Effect(getter)
    effect.scheduler = function () {
      if (!effect.active || !effect.dirty) return
      const newValue = effect.run()
      cb.call(field, newValue)
    }
    effect.run()
    return effect
  }
}

export function defineRelation(relation: Relation | Relation[]) {
  if (isArray(relation)) {
    return (relation as Relation[]).map(createRelation)
  } else {
    return [createRelation(relation)]
  }
}
