
export const convertToFormData = (data: any) => {
    

    const booleanKeys = ['is_email_verified' ,'is_kyc_verified'];

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {

        if (key === "address" && typeof value === "object" && value !== null) {
            Object.entries(value).forEach(([addrKey, addrValue]) => {
                formData.append(`address[${addrKey}]`, addrValue?.toString() ?? "");
            });
        } 
        else if (key === "image" && value instanceof File) {
            formData.append(key, value);
        } 
        else if (booleanKeys.includes(key)) {
            formData.append(key, JSON.stringify(value));
        } 
        else {
            formData.append(key, value ?? "" as any);
        }
    });

    return formData;
};
