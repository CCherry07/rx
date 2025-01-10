import type { AbstractModel } from "./abstract_model";
import { Signal } from "alien-signals";
import { BoolsConfig, BoolValues } from "../boolless";
import { Field, FieldErrors } from "../controls/field";
import { Resolver } from "../resolvers/type";
import { DeepSignal } from "alien-deepsignals";

export interface FormConfig {
  graph: typeof Field[];
  defaultValidatorEngine: string;
  boolsConfig: Record<string, (...args: any[]) => boolean>;
  id: string;
  resolvers?: {
    validator?: Record<string, Resolver>
  }
}

export type Model = Record<string, any>;


export interface SubscribeProps<M> {
  bools: BoolValues;
  submitted: Signal<boolean>;
  errors: Record<string, FieldErrors>;
  model: M;
  isPending: Signal<boolean>
}

export type AbstractModelMethods = Pick<AbstractModel<DeepSignal<Model>>, 'getFieldValue' | 'setFieldValue' | 'setFieldErrors' | 'setErrors' | 'setFieldProps' | 'cleanErrors' | 'onSubscribe' | "peekFieldValue">

export interface AbstractModelInitOptions<M extends Model> {
  defaultValidatorEngine: string;
  boolsConfig: BoolsConfig<M>
  graph: Field[]
  fields: Record<string, Field>
}

export interface AbstractModelConstructor {
  provides?: Record<string, any>
}
