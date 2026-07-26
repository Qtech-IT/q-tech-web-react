import { SubmitFunction } from "@/Types"
import { User } from "@/Types/User"



/**
 *
 * @param {*} data
 * @param {*} user
 */
export const  onAccountUpdate =  async (data:any,user:User,submit:SubmitFunction , routePrefix :string) => {

    try {
        await submit({
            method: 'POST',
            url: route(`${routePrefix}.update`, user?.id as any) + '?_method=PATCH',
            headers: {
             'Content-Type': 'multipart/form-data'
            },
            data: data,
        })
    } catch (error) {


    }
}


/**
 *
 * @param {*} data
 * @param {*} submit
 */
export const  onPasswordUpdate =  async (data :any,submit : SubmitFunction,form :any , routePrefix :string) => {

    try {
        await submit({
            method: 'POST',
            url: route(`${routePrefix}.password.update`),
            data: data,
        })

        form.reset({
            password: '',
            password_confirmation: ''
        })

    } catch (error) {

    }
}


/**
 *
 * @param {*} submitFn
 */
export const  handle2faVerifyRequest = async ( data : any,submitFn :SubmitFunction,onOpenChange:any ,routePrefix :string) => {
    try {
      await submitFn({
        method: 'POST',
        url: route(`${routePrefix}.verify`),
        data: data,
        onSuccess:(response :any)=>{
            if(response?.props?.flash?.success){
                onOpenChange(false)
            }
        }
      })
    } catch (error) {

    }
}



/**
 *
 * @param {*} submitFn
 */
export const  handleRegenerate2faCodes = async (submitFn:SubmitFunction , routePrefix:string) => {
    try {
      await submitFn({
        method: 'POST',
        url: route(`${routePrefix}.regenerate.code`),
      })
    } catch (error) {

    }
}



/**
 *
 * @param {*} submitFn
 */
export const  handle2faDisable  = async (submitFn :SubmitFunction , routePrefix : string) => {
    try {
      await submitFn({
        method: 'POST',
        url: route(`${routePrefix}.disable`),

      })
    } catch (error) {

    }
}
