import React from 'react';
import { Input as AInput, Form } from "antd"
interface Props {
  errors: any;
  value: any
  onChange: any
  title: string
  isDisabled: boolean
  onBlur: Function
  onFocus: Function
}
export default function Input(props: Props) {
  const { onChange, value, errors, title, isDisabled, onBlur, onFocus } = props
  const errorNode = errors ? <div style={{ color: "red" }}>
    {
      Object.entries(errors).map(([key, value]) => {
        return <div key={key} color='red'> {key}：{value.message}</div>
      })
    }
  </div> : null
  return <div>
    <Form.Item label={title}>
      <AInput disabled={isDisabled} value={value}
        onFocus={() => {
          onFocus()
        }}
        onBlur={(e) => {
          onBlur(e.target.value)
        }}
        onChange={(e) => {
          onChange(e.target.value)
        }} />
      {errorNode}
    </Form.Item>
  </div>
}
