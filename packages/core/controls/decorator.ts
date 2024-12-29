import { SignalValue } from "@rxform/shared";
import { BoolValues, Decision } from "../boolless";
import { ValidateItem } from "../validator";
import { Field } from "./field";
import { Signal } from "@preact/signals-core";
import { Model } from "../model/abstract_model";

export const METADATA_COMPONENT = 'component:metadata'
export const METADATA_VALIDATOR = 'validator:metadata'
export const METADATA_SIGNALS = 'signals:metadata'
export const METADATA_EVENTS = 'events:metadata'
export const METADATA_ACTIONS = 'actions:metadata'
export const METADATA_PROPS = 'props:metadata'

export interface ComponentMetaData {
  id: string;
  component?: any;
  hidden?: Decision;
  disabled?: Decision;
  props?: PropsMetaData
  recoverValueOnHidden?: boolean
  recoverValueOnShown?: boolean
  properties?: typeof Field[]
}
export function Component(metadata: ComponentMetaData): ClassDecorator {
  return function (constructor: Function) {
    Reflect.defineMetadata(METADATA_COMPONENT, metadata, constructor);
  };
}

export function getComponentMetaData(target: Function) {
  return Reflect.getMetadata(METADATA_COMPONENT, target) as ComponentMetaData;
}

export interface ValidatorMetaData {
  signal?: Record<string, ValidateItem[]>;
  initiative?: Record<string, ValidateItem[]>;
}
export function Validator(metadata: ValidatorMetaData): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(METADATA_VALIDATOR, metadata, target);
  };
}

export function getValidatorMetaData(target: Function) {
  return Reflect.getMetadata(METADATA_VALIDATOR, target) as ValidatorMetaData;
}

export type SignalsMetaData = Record<string, (this: Field, value: SignalValue<Field['value']>, bools: BoolValues, model: Signal<Model>) => void>;
export function Signals(metadata: SignalsMetaData): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(METADATA_SIGNALS, metadata, target);
  };
}

export function getSignalsMetaData(target: Function) {
  return Reflect.getMetadata(METADATA_SIGNALS, target) as SignalsMetaData;
}

export type EventMetaData = Record<string, (this: Field, value: SignalValue<Field['value']>) => void>;
export function Events(metadata: EventMetaData): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(METADATA_EVENTS, metadata, target);
  };
}

export function getEventsMetaData(target: Function) {
  return Reflect.getMetadata(METADATA_EVENTS, target) as EventMetaData;
}

export interface TransferMetaData<T, D> {
  setDefaultValue?: (this: Field, model: T) => D
  onSubmitValue?: (this:Field, data: D) => T
};
export function Actions<T, D>(metadata: TransferMetaData<T, D>) {
  return function (target: Function) {
    Reflect.defineMetadata(METADATA_ACTIONS, metadata, target);
  };
}

export function getActionsMetaData<T, D>(target: Function) {
  return Reflect.getMetadata(METADATA_ACTIONS, target) as TransferMetaData<T, D>;
}

export interface PropsMetaData {
  [key: string]: any;
}
export function Props(metadata: PropsMetaData): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata(METADATA_PROPS, metadata, target);
  };
}

export function getPropsMetaData(target: Function) {
  return Reflect.getMetadata(METADATA_PROPS, target) as PropsMetaData;
}
