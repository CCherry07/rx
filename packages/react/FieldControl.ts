import { ComponentClass, createElement, FunctionComponent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldBuilder } from "@formula/core"
import { batch, effect } from "alien-deepsignals"
import { effectScope } from "alien-signals"
import { Field } from '@formula/core/types/field';
interface Props {
  field: FieldBuilder
  resolveComponent: (component: string | FunctionComponent<any> | ComponentClass<any, any>) => string | FunctionComponent<any> | ComponentClass<any, any>
};

function normalizeProps(field: FieldBuilder) {
  return field.getProps()
}
function normalizeEvents(field: FieldBuilder) {
  return field.getEvents()
}
export function FieldControl(props: Props) {
  const { field, resolveComponent } = props;
  if (!field.getComponent()) {
    return null
  }
  
  const [filedState, setFiledState] = useState(() => normalizeProps(field))
  const [isHidden, setIsHidden] = useState(() => field.isHidden.value)
  const [isDisabled, setIsDisabled] = useState(() => field.isDisabled.value)

  const triggerValidate = useCallback((key: string) => {
    return field.validate({
      value: field.value,
      updateOn: key,
    })
  }, [])

  const methods = useMemo(() => {
    const _events = field.getEvents()
    const onChange = (async function (this: Field<FieldBuilder>, ...args: any[]) {
      if (_events.onChange) {
        await _events.onChange(...args)
      } else {
        this.value = args[0]
      }
      triggerValidate("onChange")
    }).bind(field)

    const onBlur = (value: any) => {
      _events.onBlur?.(value)
      batch(() => {
        field.isFocused.value = false
        field.isBlurred.value = true
      })
      triggerValidate("onBlur")
    }

    const onFocus = () => {
      if (_events.onFocus) {
        _events.onFocus()
      }
      batch(() => {
        field.isBlurred.value = false
        field.isFocused.value = true
      })
    }
    const events = {} as Record<string, Function>
    Object.entries(normalizeEvents(field)).forEach(([key, event]) => {
      if (key === "onChange" || key === "onBlur" || key === "onFocus") {
        return
      }
      events[key] = (...args: any[]) => {
        event(...args)
        triggerValidate(key)
      }
    })

    return {
      ...events,
      onChange,
      onBlur,
      onFocus,
    }
  }, [])
  useEffect(() => {
    const stopScope = effectScope(() => {
      effect(() => {
        setFiledState(normalizeProps(field))
      });
      effect(() => {
        setIsHidden(field.isHidden.value)
      })
      effect(() => {
        setIsDisabled(field.isDisabled.value)
      })
    });
    field.onMounted?.()
    field.isMounted.value = true
    return () => {
      stopScope()
      field.onDestroy?.()
      field.onUnmounted?.()
      field.isDestroyed.value = true
    }
  }, [])

  function getChildren(): ReactNode[] | undefined {
    const properties = field.getProperties()
    if (properties) {
      return properties.map((child) => {
        return createElement(FieldControl, {
          key: child.path,
          field: child,
          resolveComponent
        })
      })
    }
  }

  const component = useMemo(() => resolveComponent(field.getComponent()), [field.getComponent()])

  return createElement("div", {
    "data-field-id": field.id,
    hidden: isHidden,
  },
    createElement(component, {
      key: field.path,
      disabled: isDisabled,
      ...filedState,
      ...methods,
    }, getChildren())
  );
}
