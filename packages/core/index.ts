import "reflect-metadata"
export * from "./controls/fieldControl"
export * from "./model/form"
export * from "./controls/decorator"
export * from "./boolless"
export * from "./stream"
export * from "@rxform/shared"
export {
  setup as setupValidator,
  validate
} from "./validator"

export { createTemplateLiterals as js } from "@rxform/shared"
