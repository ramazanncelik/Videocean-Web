import { object, string, ref } from 'yup';

export const signUpValidations = (language) => object({
    Email: string()
        .required(language.includes("tr") ?
            'E-mail Adresi Boş Geçilemez'
            :
            'E-mail Adress Cannot be blank')
        .email(language.includes("tr") ?
            'Geçerli bir e-mail adresi giriniz!'
            :
            'Please enter a valid e-mail address!'),
    NickName: string()
        .trim()
        .required(language.includes("tr") ?
            'Kullanıcı Adı Boş Geçilemez!'
            :
            'Nick Name Cannot be blank!')
        .matches(/^[^\s]*$/, language.includes("tr") ?
            "Kullanıcı adı boşluk içeremez" :
            "Username cannot contain spaces")
        .max(30, language.includes("tr") ?
            "Kullanıcı adı en fazla 30 karakter olabilir"
            :
            "Username can be up to 30 characters"),
    Password: string()
        .required(language.includes("tr") ?
            'Şifre Boş Geçilemez!'
            :
            'Password Cannot be blank!')
        .min(6, ({ min }) => language.includes("tr") ?
            'Şifre en az ' + min + ' karakterden oluşmalıdır!'
            :
            'Password must be at least' + min + 'characters!'),
    PasswordConfirm: string()
        .oneOf([ref("Password")], language.includes("tr") ?
            "Şifreler aynı olmalıdır!"
            : "Passwords must match!")
        .required(language.includes("tr") ?
            'Boş Geçilemez!'
            :
            'Cannot be blank!'),
});

export const loginValidations = (language) => object({
    Email: string()
        .required(language.includes("tr") ?
            'E-mail Adresi Boş Geçilemez'
            :
            'E-mail Adress Cannot be blank')
        .email(language.includes("tr") ?
            'Geçerli bir e-mail adresi giriniz!'
            :
            'Please enter a valid e-mail address!'),
    Password: string()
        .required(language.includes("tr") ?
            'Şifre Boş Geçilemez!'
            :
            'Password Cannot be blank!')
        .min(1, ({ min }) => language.includes("tr") ?
            'Şifre en az ' + min + ' karakterden oluşmalıdır!'
            :
            'Password must be at least' + min + 'characters!'),
});

export const createResetPasswordMailValidations = (language) => object({
    Email: string()
        .required(language.includes("tr") ?
            'E-mail Adresi Boş Geçilemez'
            :
            'E-mail Adress Cannot be blank')
        .email(language.includes("tr") ?
            'Geçerli bir e-mail adresi giriniz!'
            :
            'Please enter a valid e-mail address!'),
});

export const updatePasswordValidations = (language) => object({
    password: string()
        .required(language.includes("tr") ?
            'Şifre Boş Geçilemez!'
            :
            'Password Cannot be blank!')
        .min(6, ({ min }) => language.includes("tr") ?
            'Şifre en az ' + min + ' karakterden oluşmalıdır!'
            :
            'Password must be at least' + min + 'characters!'),
    passwordConfirm: string()
        .oneOf([ref("password")], language.includes("tr") ?
            "Şifreler aynı olmalıdır!"
            : "Passwords must match!")
        .required(language.includes("tr") ?
            'Boş Geçilemez!'
            :
            'Cannot be blank!'),
});

export const newVideoValidations = (language) => object({
    Title: string()
        .required(language.includes("tr") ?
            'Başlık Boş Geçilemez!'
            :
            'Title Cannot be blank!')
        .max(500, language.includes("tr") ?
            "Başlık en fazla 1000 karakter olabilir"
            :
            "Title can be up to 1000 characters"),
    Description: string()
        .required(language.includes("tr") ?
            'Açıklama Boş Geçilemez!'
            :
            'Description Cannot be blank!')
        .max(2500, language.includes("tr") ?
            "Açıklama en fazla 1000 karakter olabilir"
            :
            "Description can be up to 1000 characters"),
    Category: string()
        .required(language.includes("tr") ?
            'Kategori Boş Geçilemez!'
            :
            'Category Cannot be blank!')
});

export const newComplaintValidations = (language) => object({
    Title: string()
        .required(language.includes("tr") ?
            'Başlık Boş Geçilemez!'
            :
            'Title Cannot be blank!')
        .min(2, ({ min }) => language.includes("tr") ? "Lütfen Bir Başlık Seçiniz..." : "Please Select a Title..."),
    Description: string()
        .required(language.includes("tr") ?
            'Açıklama Boş Geçilemez!'
            :
            'Description Cannot be blank!')
        .max(2500, language.includes("tr") ?
            "Açıklama en fazla 1000 karakter olabilir"
            :
            "Description can be up to 1000 characters"),
});