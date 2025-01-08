import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Validator,
  D, Field, Component,
  Props,
  Actions,
  Condition,
  DispatchData,
  SubscribeData,
} from "@rxform/core"
import Form from "./components/Form"
import Input from "./components/Input"
import InputType from "./components/InputType"
import Checkbox from "./components/Checkbox"
import InputNumber from "./components/InputNumber"
import Cascader from './components/Cascader';
import Select from './components/Select';
import { Card as CardComponent } from './components/Card';
import { createGroupForm } from "@rxform/react"
import { App } from "./App"
import { z } from 'zod';
import { zodResolver } from "@rxform/resolvers"
import { DeepSignal } from 'alien-deepsignals';

type Model = DeepSignal<{
  userinfo: {
    email: string,
    password: number,
    nickname: string,
    residence: string[]
    phone: number,
    donation: number,
  }
}>
const bools = {
  isNickname: (model: Model) => model.userinfo.nickname === "cherry"
}
@Component({
  id: 'phone',
  component: 'inputNumber',
  props: {
    title: "Phone Number"
  }
})
class Phone extends Field {
  constructor(){
    super()
  }

  @Condition(D.use('isNickname'))
  setOptions() {
    console.log("setOptions 执行了");
    this.userinfo = Math.floor(Math.random() * 100)
    console.log(this);

  }
}

@Component({
  id: 'email',
  component: 'input',
  hidden: D.use('isNickname'),
  recoverValueOnShown: true,
})
class Email extends Field {
  constructor() {
    super()
  }
  onInit(): void {
  }
  onDestroy(): void {
  }
  onChange(data: any) {
    this.value = data
  }
}
@Component({
  id: 'password',
  component: "inputType",
  disabled: D.use('isNickname'),
  props: {
    type: "Password",
    title: "password"
  }
})
class Password extends Field {
}

@Component({
  id: "nickname",
  component: "input",
  props: {
    title: "Nickname"
  }
})
class Nickname extends Field {
  @SubscribeData('userinfo')
  onUserInfo(data: any) {
    console.log("onUserInfo", data);
  }
}

@Component({
  id: "residence",
  component: "cascader",
  props: {
    title: "Habitual Residence",
    options: [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
    ]
  }
})
class Residence extends Field {
}

@Component({
  id: "donation",
  component: "inputNumber",
  props: {
    title: "Donation"
  }
})
class Donation extends Field {

}

@Component({
  id: "intro",
  component: "inputType",
  props: {
    title: "Intro",
    type: "TextArea"
  }
})
class Intro extends Field {
}
@Component({
  id: "gender",
  component: "select",
  props: {
    title: "Gender",
    options: [
      {
        value: "male",
        label: "Male"
      },
      {
        value: "female",
        label: "Female"
      },
      {
        value: "other",
        label: "Other"
      }
    ]
  }
})
class Gender extends Field {
}
@Component({
  id: "captcha",
  component: "input",
  props: {
    title: "Captcha",
  }
})
class Captcha extends Field {

}
@Component({
  id: "agreement",
  component: "checkbox",
  props: {
    title: "Captcha",
  }
})
class Agreement extends Field {

}

@Component({
  id: 'userinfo',
  component: 'form',
  properties: [
    Email,
    Password,
    Nickname,
    Residence,
    Phone,
    Donation,
    Intro,
    Gender,
    Captcha,
    Agreement
  ],
  props: {
    style: {
      width: "400px"
    }
  }
})
@Actions({
  setDefaultValue() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          password: 123456,
          phone: 12345678901,
          donation: 100,
          intro: "I am a good man",
        })
      })
    })
  }
})
class UserInfo extends Field {
  @DispatchData("userinfo", false)
  userinfo = {}

  @Condition(D.use('isNickname'))
  setOptions() {
    console.log("setOptions 执行了");
    this.userinfo = Math.floor(Math.random() * 100)
    console.log(this);

  }
}
const graph = [
  UserInfo
]

const formGroup = createGroupForm()
const form1 = formGroup.add({
  defaultValidatorEngine: "zod",
  boolsConfig: bools,
  graph,
  id: 'form1',
  resolvers: {
    validator: {
      zod: zodResolver
    }
  },
  components: {
    form: Form,
    input: Input,
    checkbox: Checkbox,
    card: CardComponent,
    inputType: InputType,
    inputNumber: InputNumber,
    cascader: Cascader,
    select: Select
  }
})
// const form2 = formGroup.add({
//   defaultValidatorEngine: "zod",
//   boolsConfig: bools,
//   graph,
//   id: 'form2',
//   resolvers: {
//     validator: {
//       zod: zodResolver
//     }
//   },
//   components: {
//     form: Form,
//     input: Input,
//     checkbox: Checkbox,
//     card: CardComponent,
//     inputType: InputType,
//     inputNumber: InputNumber,
//     cascader: Cascader,
//     select: Select
//   }
// })

const root = createRoot(document.getElementById('root')!);
root.render(<App apps={[
  form1.app,
]} forms={[
  form1.form,
]} />);
