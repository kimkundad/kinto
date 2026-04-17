<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

type LanguageOption = {
  code: 'TH' | 'EN'
  label: string
  flagSrc: string
}

type NavItem = { key: 'home' | 'registration' | 'terms'; label: string }

type StepItem = {
  number: 1 | 2 | 3
  label: string
}

const languages: LanguageOption[] = [
  { code: 'TH', label: 'ไทย', flagSrc: '/flags/thai.png' },
  { code: 'EN', label: 'English', flagSrc: '/flags/kingdom.png' },
]

const translations = {
  TH: {
    nav: { home: 'เว็บไซต์หลัก', registration: 'ลงทะเบียนรับประกันสินค้า', terms: 'เงื่อนไขการรับประกัน' },
    steps: ['ข้อมูลส่วนตัว', 'ข้อมูลการซื้อ', 'ข้อมูลรถ'],
    hero: {
      titleReg: 'ลงทะเบียนรับประกันยางคินโตะ ไทร์',
      titleTerms: 'เงื่อนไขการรับประกันยางคินโตะ ไทร์',
    },
    reg: {
      cardTitle: 'ลงทะเบียนรับประกันสินค้า',
      cardSubtitle: 'ลงทะเบียนยางใหม่ของคุณเพื่อความอุ่นใจ ง่ายๆ เพียง 3 ขั้นตอน',
      stepTitles: ['ขั้นตอนที่ 1: ข้อมูลส่วนตัว', 'ขั้นตอนที่ 2: ข้อมูลการซื้อ', 'ขั้นตอนที่ 3: ข้อมูลรถ'],
      stepDescs: [
        'กรุณาระบุข้อมูลติดต่อของคุณเพื่อออกใบรับรองการรับประกัน',
        'กรุณาระบุข้อมูลการสั่งซื้อเพื่อเป็นประโยชน์ในระยะเวลาการรับประกัน',
        'กรุณาระบุรายละเอียดของรถที่คุณติดตั้งยาง Kinto',
      ],
      fullName: 'ชื่อ-นามสกุล', fullNamePh: 'กรอกชื่อ-นามสกุลของคุณ',
      address: 'ที่อยู่', addressPh: 'บ้านเลขที่, ถนน, ตำบล/แขวง',
      province: 'จังหวัด', provincePh: 'เลือกจังหวัด',
      postalCode: 'รหัสไปรษณีย์', postalCodePh: 'กรอกรหัสไปรษณีย์',
      email: 'อีเมล',
      phone: 'เบอร์โทรศัพท์',
      dealerName: 'ชื่อตัวแทนจำหน่าย / ร้านค้าที่สั่งซื้อ', dealerNamePh: 'โปรดระบุชื่อ',
      purchaseDate: 'วันที่ซื้อ', purchaseDatePh: 'เลือกวันที่ซื้อ',
      tireModel: 'รุ่น/ขนาดของยาง', tireModelPh: 'เช่น K-Sport 225/45R18',
      invoiceNumber: 'เลขที่ใบเสร็จ',
      uploadReceipt: 'อัพโหลดใบเสร็จ',
      uploadClick: 'คลิกเพื่ออัพโหลด หรือลากไฟล์มาวาง',
      uploadChange: 'คลิกเพื่อเปลี่ยนรูป',
      uploadDocDone: 'อัพโหลดเอกสารเรียบร้อยแล้ว',
      uploadHint: 'PNG, JPG หรือ PDF (สูงสุด 10MB)',
      vehicleBrand: 'ยี่ห้อ / รุ่นรถ', vehicleBrandPh: 'โปรดระบุชื่อ',
      licensePlate: 'เลขทะเบียนรถ', licensePlatePh: 'เช่น กข 1234',
      regProvince: 'จังหวัด', regProvincePh: 'เลือกจังหวัดจดทะเบียน',
      termsCheck: 'ข้าพเจ้าได้อ่านและยอมรับใน เงื่อนไขการรับประกัน และนโยบายความเป็นส่วนตัว บริษัท คินโตะ ไทร์ (ประเทศไทย) จำกัด',
      noticePrefix: 'โปรดตรวจสอบข้อมูลให้ถูกต้องเพื่อสิทธิประโยชน์ของตัวท่านเอง ระบบจะส่งข้อมูลยืนยันการลงทะเบียนไปยังหมายเลขเบอร์โทรศัพท์',
      btnNext: 'ต่อไป', btnSave: 'บันทึกและไปต่อ', btnSubmit: 'ส่งข้อมูลลงทะเบียน', btnBack: 'ย้อนกลับ',
      doneTitle: 'ลงทะเบียนเสร็จสมบูรณ์',
      doneThank: 'ขอบคุณที่เลือก Kinto ค่ะ',
      doneDesc1: 'การลงทะเบียนรับประกันของคุณเสร็จสมบูรณ์แล้ว',
      doneDesc2: 'คุณจะได้รับข้อความยืนยันในเร็วๆ นี้',
      btnHome: 'กลับสู่หน้าหลัก', termsLink: 'เงื่อนไขการรับประกัน',
    },
    terms: {
      title: 'เงื่อนไขการรับประกัน',
      subtitle: 'ตัวอย่างเนื้อหาเบื้องต้นสำหรับหน้าเงื่อนไขการรับประกันยางรถยนต์ Kinto',
      s1Title: '1. ขอบเขตการรับประกัน',
      s1Body: 'การรับประกันนี้ครอบคลุมยางรถยนต์ Kinto ที่ซื้อจากตัวแทนจำหน่ายที่ได้รับอนุญาต และลงทะเบียนรับประกันผ่านเว็บไซต์ภายในระยะเวลาที่บริษัทกำหนดหลังวันซื้อสินค้า',
      s2Title: '2. เอกสารที่ใช้ประกอบการพิจารณา',
      s2Items: ['ใบเสร็จรับเงินหรือหลักฐานการซื้อสินค้า', 'ข้อมูลรถที่ติดตั้งยางและข้อมูลเจ้าของที่ลงทะเบียน'],
      s3Title: '3. กรณีที่อยู่ในเงื่อนไขรับประกัน',
      s3Body: 'บริษัทจะพิจารณาความบกพร่องที่เกิดจากกระบวนการผลิต วัสดุ หรือความผิดปกติของโครงสร้างยาง ภายใต้การใช้งานตามปกติและเป็นไปตามข้อกำหนดของผู้ผลิต',
      s4Title: '4. กรณีที่ไม่อยู่ในเงื่อนไขรับประกัน',
      s4Items: ['ความเสียหายจากอุบัติเหตุ การกระแทก การบาดตำ หรือของมีคม', 'การใช้งานผิดประเภท การบรรทุกเกินกำหนด หรือแรงดันลมไม่เหมาะสม', 'การสึกหรอจากการใช้งานตามปกติ หรือการติดตั้ง/ถอดยางที่ไม่ถูกวิธี'],
      s5Title: '5. ขั้นตอนการเคลมเบื้องต้น',
      s5Body: 'เมื่อลูกค้าพบปัญหา สามารถติดต่อ Call Center หรือผู้แทนจำหน่าย พร้อมนำส่งหลักฐานการซื้อ รูปถ่ายสินค้า และรายละเอียดการใช้งาน เพื่อให้บริษัทตรวจสอบและแจ้งผลการพิจารณาตามลำดับ',
      s6Title: '6. หมายเหตุเพิ่มเติม',
      s6Body: 'บริษัทขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขการรับประกันโดยไม่ต้องแจ้งให้ทราบล่วงหน้า ทั้งนี้การพิจารณาของบริษัทถือเป็นที่สิ้นสุดภายใต้ข้อกำหนดที่ประกาศใช้อยู่ ณ เวลานั้น',
    },
    footer: {
      location: 'สถานที่ตั้ง',
      privacy: 'นโยบายคุ้มครองข้อมูลส่วนบุคคล',
      companyName: 'บริษัท คินโตะ ไทร์ (ประเทศไทย) จำกัด',
      address1: '399/41-42 หมู่ที่ 13 ซอยกิ่งแก้ว 25/1 ถนนกิ่งแก้ว ตำบลราชาเทวะ อำเภอบางพลี',
      address2: 'จังหวัดสมุทรปราการ 10540',
    },
    modal: { title: 'กรอกข้อมูลไม่ครบถ้วน', ok: 'ตกลง' },
    validation: {
      step1: 'กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วนและตรวจสอบรูปแบบอีเมล/ตัวเลขให้ถูกต้อง',
      step2: 'กรุณากรอกข้อมูลการซื้อให้ครบทุกช่อง เลือกวันที่ซื้อที่ไม่เกินวันปัจจุบัน และอัพโหลดใบเสร็จเพื่อดำเนินการต่อ',
      step3: 'กรุณากรอกข้อมูลรถให้ครบถ้วน และกดยอมรับเงื่อนไขการรับประกันก่อนส่งข้อมูล',
      submitFailed: 'ไม่สามารถบันทึกข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
    },
    dateLocale: 'th',
    dateFormat: 'th-TH-u-ca-buddhist',
  },
  EN: {
    nav: { home: 'Main Website', registration: 'Warranty Registration', terms: 'Warranty Terms' },
    steps: ['Personal Info', 'Purchase Info', 'Vehicle Info'],
    hero: {
      titleReg: 'Kinto Tyre Warranty Registration',
      titleTerms: 'Kinto Tyre Warranty Terms & Conditions',
    },
    reg: {
      cardTitle: 'Product Warranty Registration',
      cardSubtitle: 'Register your new tyre for peace of mind in 3 easy steps',
      stepTitles: ['Step 1: Personal Information', 'Step 2: Purchase Information', 'Step 3: Vehicle Information'],
      stepDescs: [
        'Please provide your contact details to issue a warranty certificate.',
        'Please provide your purchase information for warranty purposes.',
        'Please provide the vehicle details where your Kinto tyres are installed.',
      ],
      fullName: 'Full Name', fullNamePh: 'Enter your full name',
      address: 'Address', addressPh: 'House number, street, sub-district',
      province: 'Province', provincePh: 'Select Province',
      postalCode: 'Postal Code', postalCodePh: 'Enter postal code',
      email: 'E-Mail',
      phone: 'Mobile Phone',
      dealerName: 'Dealer / Shop Name', dealerNamePh: 'Please specify',
      purchaseDate: 'Date of Purchase', purchaseDatePh: 'Select purchase date',
      tireModel: 'Tyre Pattern / Size', tireModelPh: 'e.g. K-Sport 225/45R18',
      invoiceNumber: 'Receipt Number',
      uploadReceipt: 'Attach Receipt',
      uploadClick: 'Click to upload or drag and drop',
      uploadChange: 'Click to change image',
      uploadDocDone: 'Document uploaded successfully',
      uploadHint: 'PNG, JPG or PDF (max 10MB)',
      vehicleBrand: 'Vehicle Brand / Model', vehicleBrandPh: 'Please specify',
      licensePlate: 'License Plate', licensePlatePh: 'e.g. AB 1234',
      regProvince: 'Province', regProvincePh: 'Select registration province',
      termsCheck: 'I have read and accepted the Warranty Terms and Privacy Policy of Kinto Tyre (Thailand) Co., Ltd.',
      noticePrefix: 'Please verify your information for your own benefit. A registration confirmation will be sent to phone number',
      btnNext: 'Next', btnSave: 'Save & Continue', btnSubmit: 'Submit Registration', btnBack: 'Back',
      doneTitle: 'Registration Complete',
      doneThank: 'Thank you for choosing Kinto',
      doneDesc1: 'Your warranty registration is complete.',
      doneDesc2: 'You will receive a confirmation message shortly.',
      btnHome: 'Return to Home', termsLink: 'Warranty Terms',
    },
    terms: {
      title: 'Warranty Terms & Conditions',
      subtitle: 'Draft content for Kinto Tyre warranty terms and conditions',
      s1Title: '1. Warranty Coverage',
      s1Body: 'This warranty covers Kinto brand tyres purchased from an authorised dealer and registered on the website within the period specified by the company after the date of purchase.',
      s2Title: '2. Supporting Documents',
      s2Items: ['Receipt or proof of purchase', 'Vehicle details where tyres are installed and registered owner information'],
      s3Title: '3. Conditions Covered by Warranty',
      s3Body: 'The company will consider defects arising from the manufacturing process, materials, or structural abnormalities of the tyre under normal use and in accordance with manufacturer specifications.',
      s4Title: '4. Conditions Not Covered by Warranty',
      s4Items: ['Damage from accidents, impacts, cuts, or sharp objects', 'Misuse, overloading, or incorrect tyre pressure', 'Normal wear and tear, or improper tyre installation/removal'],
      s5Title: '5. Basic Claim Procedure',
      s5Body: 'When a customer encounters an issue, they may contact the Call Center or dealer, providing proof of purchase, product photos, and usage details so the company can investigate and communicate the outcome accordingly.',
      s6Title: '6. Additional Notes',
      s6Body: 'The company reserves the right to amend warranty terms without prior notice. The company\'s decision shall be final under the terms in effect at the time of the claim.',
    },
    footer: {
      location: 'Location',
      privacy: 'Personal Data Protection Policy',
      companyName: 'Kinto Tyre (Thailand) Co., Ltd.',
      address1: '399/41-42 Moo 13, Soi King Kaew 25/1, King Kaew Road, Rachathewa, Bang Phli',
      address2: 'Samut Prakan 10540',
    },
    modal: { title: 'Incomplete Information', ok: 'OK' },
    validation: {
      step1: 'Please fill in all personal information and verify the email/number format.',
      step2: 'Please complete all purchase fields, select a valid purchase date, and upload your receipt.',
      step3: 'Please complete all vehicle fields and accept the warranty terms before submitting.',
      submitFailed: 'Unable to save data at this time. Please try again.',
    },
    dateLocale: 'en',
    dateFormat: 'en-GB',
  },
} as const

const thailandProvinces = [
  'กรุงเทพมหานคร',
  'กระบี่',
  'กาญจนบุรี',
  'กาฬสินธุ์',
  'กำแพงเพชร',
  'ขอนแก่น',
  'จันทบุรี',
  'ฉะเชิงเทรา',
  'ชลบุรี',
  'ชัยนาท',
  'ชัยภูมิ',
  'ชุมพร',
  'เชียงราย',
  'เชียงใหม่',
  'ตรัง',
  'ตราด',
  'ตาก',
  'นครนายก',
  'นครปฐม',
  'นครพนม',
  'นครราชสีมา',
  'นครศรีธรรมราช',
  'นครสวรรค์',
  'นนทบุรี',
  'นราธิวาส',
  'น่าน',
  'บึงกาฬ',
  'บุรีรัมย์',
  'ปทุมธานี',
  'ประจวบคีรีขันธ์',
  'ปราจีนบุรี',
  'ปัตตานี',
  'พระนครศรีอยุธยา',
  'พะเยา',
  'พังงา',
  'พัทลุง',
  'พิจิตร',
  'พิษณุโลก',
  'เพชรบุรี',
  'เพชรบูรณ์',
  'แพร่',
  'ภูเก็ต',
  'มหาสารคาม',
  'มุกดาหาร',
  'แม่ฮ่องสอน',
  'ยะลา',
  'ยโสธร',
  'ร้อยเอ็ด',
  'ระนอง',
  'ระยอง',
  'ราชบุรี',
  'ลพบุรี',
  'ลำปาง',
  'ลำพูน',
  'เลย',
  'ศรีสะเกษ',
  'สกลนคร',
  'สงขลา',
  'สตูล',
  'สมุทรปราการ',
  'สมุทรสงคราม',
  'สมุทรสาคร',
  'สระแก้ว',
  'สระบุรี',
  'สิงห์บุรี',
  'สุโขทัย',
  'สุพรรณบุรี',
  'สุราษฎร์ธานี',
  'สุรินทร์',
  'หนองคาย',
  'หนองบัวลำภู',
  'อ่างทอง',
  'อำนาจเจริญ',
  'อุดรธานี',
  'อุตรดิตถ์',
  'อุทัยธานี',
  'อุบลราชธานี',
] as const

const selectedLanguage = ref<LanguageOption>(languages[0])

const t = computed(() => translations[selectedLanguage.value.code])

const navItems = computed<NavItem[]>(() => [
  { key: 'home', label: t.value.nav.home },
  { key: 'registration', label: t.value.nav.registration },
  { key: 'terms', label: t.value.nav.terms },
])

const stepItems = computed<StepItem[]>(() => [
  { number: 1, label: t.value.steps[0] },
  { number: 2, label: t.value.steps[1] },
  { number: 3, label: t.value.steps[2] },
])
const currentPage = ref<'registration' | 'terms'>('registration')
const currentStep = ref<1 | 2 | 3 | 4>(1)
const isSubmitting = ref(false)
const purchaseDateMenu = ref(false)
const receiptPreviewUrl = ref('')
const receiptPreviewType = ref<'image' | 'document' | ''>('')
const validationDialog = ref(false)
const validationMessage = ref('')
const receiptFile = ref<File | null>(null)
const todayBangkokIso = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Bangkok',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date())

const formData = reactive({
  fullName: '',
  address: '',
  province: '',
  postalCode: '',
  email: '',
  phone: '',
  dealerName: '',
  purchaseDate: '',
  tireModel: '',
  invoiceNumber: '',
  receiptFileName: '',
  vehicleBrandModel: '',
  licensePlate: '',
  registrationProvince: '',
  acceptedTerms: false,
})

const stepOneErrors = reactive({
  fullName: false,
  address: false,
  province: false,
  postalCode: false,
  email: false,
  phone: false,
})

const stepTwoErrors = reactive({
  dealerName: false,
  purchaseDate: false,
  tireModel: false,
  invoiceNumber: false,
  receiptFileName: false,
})

const stepThreeErrors = reactive({
  vehicleBrandModel: false,
  licensePlate: false,
  registrationProvince: false,
  acceptedTerms: false,
})

const currentStepTitle = computed(() => t.value.reg.stepTitles[currentStep.value - 1] ?? '')
const currentStepDescription = computed(() => t.value.reg.stepDescs[currentStep.value - 1] ?? '')

const maskedPhone = computed(() => {
  const digits = formData.phone.trim()
  if (!digits) return '085 XXX XXXX'
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`
})

const formattedPurchaseDate = computed(() => {
  if (!formData.purchaseDate) return ''
  const date = new Date(formData.purchaseDate)
  if (Number.isNaN(date.getTime())) return formData.purchaseDate
  return new Intl.DateTimeFormat(t.value.dateFormat, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  }).format(date)
})

function normalizePurchaseDate(value: unknown) {
  if (!value) return ''

  const rawValue = Array.isArray(value) ? value[0] : value

  if (typeof rawValue === 'string') {
    return rawValue
  }

  if (rawValue instanceof Date && !Number.isNaN(rawValue.getTime())) {
    return rawValue.toISOString().slice(0, 10)
  }

  return ''
}

function isFuturePurchaseDate(value: string) {
  if (!value) return false
  return value > todayBangkokIso
}

async function goToNextStep() {
  if (currentPage.value === 'registration' && currentStep.value === 1 && !validateStepOne()) {
    return
  }

  if (currentPage.value === 'registration' && currentStep.value === 2 && !validateStepTwo()) {
    return
  }

  if (currentPage.value === 'registration' && currentStep.value === 3) {
    if (!validateStepThree()) {
      return
    }

    await submitRegistration()
    return
  }

  if (currentStep.value < 4) {
    currentStep.value = (currentStep.value + 1) as 1 | 2 | 3 | 4
  }
}

function goToPreviousStep() {
  if (currentStep.value > 1) {
    currentStep.value = (currentStep.value - 1) as 1 | 2 | 3 | 4
  }
}

function goHome() {
  Object.assign(formData, {
    fullName: '',
    address: '',
    province: '',
    postalCode: '',
    email: '',
    phone: '',
    dealerName: '',
    purchaseDate: '',
    tireModel: '',
    invoiceNumber: '',
    receiptFileName: '',
    vehicleBrandModel: '',
    licensePlate: '',
    registrationProvince: '',
    acceptedTerms: false,
  })
  receiptFile.value = null
  currentPage.value = 'registration'
  currentStep.value = 1
}

function goToPage(page: 'home' | 'registration' | 'terms') {
  currentPage.value = page === 'terms' ? 'terms' : 'registration'
  if (page === 'home') {
    currentStep.value = 1
  }
}

function keepOnlyDigits(field: 'postalCode' | 'phone', event: Event) {
  const target = event.target as HTMLInputElement
  formData[field] = target.value.replace(/\D/g, '')
}

function allowDigitsOnly(event: KeyboardEvent) {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
    return
  }

  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
  }
}

function pasteDigitsOnly(field: 'postalCode' | 'phone', event: ClipboardEvent) {
  event.preventDefault()
  const pastedText = event.clipboardData?.getData('text') ?? ''
  formData[field] = pastedText.replace(/\D/g, '')
}

function setPurchaseDate(value: unknown) {
  formData.purchaseDate = normalizePurchaseDate(value)
  purchaseDateMenu.value = false
}

watch(() => formData.postalCode, (value) => {
  const digitsOnly = value.replace(/\D/g, '')
  if (digitsOnly !== value) {
    formData.postalCode = digitsOnly
  }
})

watch(() => formData.phone, (value) => {
  const digitsOnly = value.replace(/\D/g, '')
  if (digitsOnly !== value) {
    formData.phone = digitsOnly
  }
})

function onReceiptUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    receiptFile.value = null
    formData.receiptFileName = ''
    receiptPreviewUrl.value = ''
    receiptPreviewType.value = ''
    return
  }

  receiptFile.value = file
  formData.receiptFileName = file.name

  if (receiptPreviewUrl.value) {
    URL.revokeObjectURL(receiptPreviewUrl.value)
    receiptPreviewUrl.value = ''
  }

  if (file.type.startsWith('image/')) {
    receiptPreviewUrl.value = URL.createObjectURL(file)
    receiptPreviewType.value = 'image'
    return
  }

  receiptPreviewType.value = 'document'
}

function validateStepOne() {
  const fullName = formData.fullName.trim()
  const address = formData.address.trim()
  const province = formData.province.trim()
  const postalCode = formData.postalCode.trim()
  const email = formData.email.trim()
  const phone = formData.phone.trim()

  stepOneErrors.fullName = fullName === ''
  stepOneErrors.address = address === ''
  stepOneErrors.province = province === ''
  stepOneErrors.postalCode = postalCode === '' || !/^\d+$/.test(postalCode)
  stepOneErrors.email = email === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  stepOneErrors.phone = phone === '' || !/^\d+$/.test(phone)

  const hasError = Object.values(stepOneErrors).some(Boolean)

  if (hasError) {
    validationMessage.value = t.value.validation.step1
    validationDialog.value = true
    return false
  }

  return true
}

function validateStepTwo() {
  const dealerName = formData.dealerName.trim()
  const purchaseDate = normalizePurchaseDate(formData.purchaseDate)
  const tireModel = formData.tireModel.trim()
  const invoiceNumber = formData.invoiceNumber.trim()
  const receiptFileName = formData.receiptFileName.trim()

  formData.purchaseDate = purchaseDate

  stepTwoErrors.dealerName = dealerName === ''
  stepTwoErrors.purchaseDate = purchaseDate === '' || isFuturePurchaseDate(purchaseDate)
  stepTwoErrors.tireModel = tireModel === ''
  stepTwoErrors.invoiceNumber = invoiceNumber === ''
  stepTwoErrors.receiptFileName = receiptFileName === ''

  const hasError = Object.values(stepTwoErrors).some(Boolean)

  if (hasError) {
    validationMessage.value = t.value.validation.step2
    validationDialog.value = true
    return false
  }

  return true
}

function validateStepThree() {
  const vehicleBrandModel = formData.vehicleBrandModel.trim()
  const licensePlate = formData.licensePlate.trim()
  const registrationProvince = formData.registrationProvince.trim()

  stepThreeErrors.vehicleBrandModel = vehicleBrandModel === ''
  stepThreeErrors.licensePlate = licensePlate === ''
  stepThreeErrors.registrationProvince = registrationProvince === ''
  stepThreeErrors.acceptedTerms = !formData.acceptedTerms

  const hasError = Object.values(stepThreeErrors).some(Boolean)

  if (hasError) {
    validationMessage.value = t.value.validation.step3
    validationDialog.value = true
    return false
  }

  return true
}

async function submitRegistration() {
  try {
    isSubmitting.value = true

    const payload = new FormData()
    payload.append('fullName', formData.fullName)
    payload.append('address', formData.address)
    payload.append('province', formData.province)
    payload.append('postalCode', formData.postalCode)
    payload.append('email', formData.email)
    payload.append('phone', formData.phone)
    payload.append('dealerName', formData.dealerName)
    payload.append('purchaseDate', formData.purchaseDate)
    payload.append('tireModel', formData.tireModel)
    payload.append('invoiceNumber', formData.invoiceNumber)
    payload.append('receiptFileName', receiptFile.value?.name ?? formData.receiptFileName)
    payload.append('vehicleBrandModel', formData.vehicleBrandModel)
    payload.append('licensePlate', formData.licensePlate)
    payload.append('registrationProvince', formData.registrationProvince)
    payload.append('acceptedTerms', String(formData.acceptedTerms))

    if (receiptFile.value) {
      payload.append('receiptFile', receiptFile.value)
    }

    const response = await fetch('/api/registrations', {
      method: 'POST',
      body: payload,
    })

    if (!response.ok) {
      throw new Error('submit_failed')
    }

    currentStep.value = 4
  } catch {
    validationMessage.value = t.value.validation.submitFailed
    validationDialog.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <v-app>
    <div class="page-shell">
      <header class="topbar">
        <div class="topbar__inner">
          <img class="brand-logo" src="/kinto_img/logo.png" alt="Kinto Tyres" />

          <nav class="topbar__nav" aria-label="Main navigation">
            <a
              v-for="item in navItems"
              :key="item.label"
              href="#"
              :class="{ 'is-active': (item.key === 'terms' && currentPage === 'terms') || (item.key !== 'terms' && currentPage === 'registration' && item.key === 'registration') }"
              @click.prevent="goToPage(item.key)"
            >
              {{ item.label }}
            </a>
          </nav>

          <v-menu location="bottom end" offset="12">
            <template #activator="{ props }">
              <button class="mobile-nav-toggle" type="button" v-bind="props" aria-label="Open navigation menu">
                <v-icon icon="mdi-menu" size="22" />
              </button>
            </template>

            <div class="mobile-nav-sheet">
              <a
                v-for="item in navItems"
                :key="`mobile-${item.label}`"
                class="mobile-nav-sheet__item"
                :class="{ 'is-active': (item.key === 'terms' && currentPage === 'terms') || (item.key !== 'terms' && currentPage === 'registration' && item.key === 'registration') }"
                href="#"
                @click.prevent="goToPage(item.key)"
              >
                {{ item.label }}
              </a>
            </div>
          </v-menu>

          <v-menu location="bottom end" offset="10">
            <template #activator="{ props }">
              <button class="lang-switch" type="button" v-bind="props">
                <img class="lang-switch__flag" :src="selectedLanguage.flagSrc" :alt="selectedLanguage.label" />
                <span>{{ selectedLanguage.code }}</span>
                <v-icon icon="mdi-chevron-down" size="16" />
              </button>
            </template>

            <div class="lang-menu">
              <button
                v-for="language in languages"
                :key="language.code"
                class="lang-menu__item"
                type="button"
                @click="selectedLanguage = language"
              >
                <img class="lang-switch__flag" :src="language.flagSrc" :alt="language.label" />
                <span>{{ language.label }}</span>
              </button>
            </div>
          </v-menu>
        </div>
      </header>

      <section class="hero">
        <div class="hero__overlay">
          <h1>{{ currentPage === 'terms' ? t.hero.titleTerms : t.hero.titleReg }}</h1>
          <p>{{ currentPage === 'terms' ? 'WARRANTY TERMS & CONDITIONS' : 'WARRANTY REGISTRATION' }}</p>
        </div>
      </section>

      <main class="main-content">
        <section v-if="currentPage === 'terms'" class="terms-card">
          <div class="terms-card__header">
            <h2>{{ t.terms.title }}</h2>
            <p>{{ t.terms.subtitle }}</p>
          </div>

          <div class="terms-card__body">
            <section class="terms-section">
              <h3>{{ t.terms.s1Title }}</h3>
              <p>{{ t.terms.s1Body }}</p>
            </section>

            <section class="terms-section">
              <h3>{{ t.terms.s2Title }}</h3>
              <ul class="terms-list">
                <li v-for="item in t.terms.s2Items" :key="item">{{ item }}</li>
              </ul>
            </section>

            <section class="terms-section">
              <h3>{{ t.terms.s3Title }}</h3>
              <p>{{ t.terms.s3Body }}</p>
            </section>

            <section class="terms-section">
              <h3>{{ t.terms.s4Title }}</h3>
              <ul class="terms-list">
                <li v-for="item in t.terms.s4Items" :key="item">{{ item }}</li>
              </ul>
            </section>

            <section class="terms-section">
              <h3>{{ t.terms.s5Title }}</h3>
              <p>{{ t.terms.s5Body }}</p>
            </section>

            <section class="terms-section">
              <h3>{{ t.terms.s6Title }}</h3>
              <p>{{ t.terms.s6Body }}</p>
            </section>
          </div>
        </section>

        <section v-else class="registration-card" :class="{ 'registration-card--complete': currentStep === 4 }">
          <template v-if="currentPage === 'registration'">
          <template v-if="currentStep !== 4">
            <div class="registration-card__header">
              <div>
                <h2>{{ t.reg.cardTitle }}</h2>
                <p>{{ t.reg.cardSubtitle }}</p>
              </div>

              <div class="stepper" aria-label="Registration steps">
                <div
                  v-for="step in stepItems"
                  :key="step.number"
                  class="step"
                  :class="{
                    'step--done': step.number < currentStep,
                    'step--active': step.number === currentStep,
                  }"
                >
                  <span class="step__circle">
                    <v-icon v-if="step.number < currentStep" icon="mdi-check" size="18" />
                    <template v-else>{{ step.number }}</template>
                  </span>
                  <span>{{ step.label }}</span>
                </div>
              </div>
            </div>

            <div class="registration-card__body">
              <div class="form-copy">
                <h3>{{ currentStepTitle }}</h3>
                <p>{{ currentStepDescription }}</p>
              </div>

              <v-form v-if="currentStep === 1" class="form-grid">
                <div class="form-row form-row--full">
                  <label>{{ t.reg.fullName }}</label>
                  <div class="field-shell" :class="{ 'field-shell--active': stepOneErrors.fullName }">
                    <input v-model="formData.fullName" type="text" :placeholder="t.reg.fullNamePh" />
                  </div>
                </div>

                <div class="form-row form-row--full">
                  <label>{{ t.reg.address }}</label>
                  <div class="field-shell field-shell--textarea" :class="{ 'field-shell--active': stepOneErrors.address }">
                    <textarea v-model="formData.address" :placeholder="t.reg.addressPh"></textarea>
                  </div>
                </div>

                <div class="form-row">
                  <label>{{ t.reg.province }}</label>
                <div class="field-shell" :class="{ 'field-shell--active': stepOneErrors.province }">
                  <select v-model="formData.province" class="field-shell__select">
                    <option value="" disabled>{{ t.reg.provincePh }}</option>
                    <option v-for="province in thailandProvinces" :key="province" :value="province">{{ province }}</option>
                  </select>
                  <v-icon icon="mdi-chevron-down" size="18" />
                </div>
              </div>

                <div class="form-row">
                  <label>{{ t.reg.postalCode }}</label>
                  <div class="field-shell" :class="{ 'field-shell--active': stepOneErrors.postalCode }">
                    <input
                      :value="formData.postalCode"
                      type="text"
                      inputmode="numeric"
                      :placeholder="t.reg.postalCodePh"
                      @keydown="allowDigitsOnly"
                      @input="keepOnlyDigits('postalCode', $event)"
                      @paste="pasteDigitsOnly('postalCode', $event)"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <label>{{ t.reg.email }}</label>
                  <div class="field-shell" :class="{ 'field-shell--active': stepOneErrors.email }">
                    <input v-model="formData.email" type="email" placeholder="example@email.com" />
                  </div>
                </div>

                <div class="form-row">
                  <label>{{ t.reg.phone }}</label>
                  <div class="field-shell" :class="{ 'field-shell--active': stepOneErrors.phone }">
                    <input
                      :value="formData.phone"
                      type="text"
                      inputmode="numeric"
                      placeholder="08XXXXXXXXX"
                      @keydown="allowDigitsOnly"
                      @input="keepOnlyDigits('phone', $event)"
                      @paste="pasteDigitsOnly('phone', $event)"
                    />
                  </div>
                </div>
              </v-form>

              <v-form v-else-if="currentStep === 2" class="form-grid form-grid--step-two">
                <div class="form-row">
                  <label>{{ t.reg.dealerName }}</label>
                  <div class="field-shell" :class="{ 'field-shell--active': stepTwoErrors.dealerName }">
                    <input v-model="formData.dealerName" type="text" :placeholder="t.reg.dealerNamePh" />
                  </div>
                </div>

                <div class="form-row">
                  <label>{{ t.reg.purchaseDate }}</label>
                  <v-menu
                    v-model="purchaseDateMenu"
                    :close-on-content-click="false"
                    location="bottom"
                    offset="10"
                  >
                    <template #activator="{ props }">
                      <button
                        class="field-shell field-shell--button"
                        :class="{ 'field-shell--active': stepTwoErrors.purchaseDate }"
                        type="button"
                        v-bind="props"
                      >
                        <span :class="['field-shell__value', { 'is-placeholder': !formData.purchaseDate }]">
                          {{ formattedPurchaseDate || t.reg.purchaseDatePh }}
                        </span>
                        <v-icon icon="mdi-calendar-month-outline" size="18" />
                      </button>
                    </template>

                    <div class="datepicker-shell">
                      <v-date-picker
                        :model-value="formData.purchaseDate"
                        :locale="t.dateLocale"
                        :max="todayBangkokIso"
                        show-adjacent-months
                        hide-header
                        color="primary"
                        @update:model-value="setPurchaseDate"
                      />
                    </div>
                  </v-menu>
                </div>

                <div class="form-row">
                  <label>{{ t.reg.tireModel }}</label>
                  <div class="field-shell" :class="{ 'field-shell--active': stepTwoErrors.tireModel }">
                    <input v-model="formData.tireModel" type="text" :placeholder="t.reg.tireModelPh" />
                  </div>
                </div>

                <div class="form-row">
                  <label>{{ t.reg.invoiceNumber }}</label>
                  <div class="field-shell" :class="{ 'field-shell--active': stepTwoErrors.invoiceNumber }">
                    <input v-model="formData.invoiceNumber" type="text" placeholder="INV-20231015-001" />
                  </div>
                </div>

                <div class="form-row form-row--full">
                  <label>{{ t.reg.uploadReceipt }}</label>
                  <label
                    class="upload-zone"
                    :class="{
                      'upload-zone--has-file': formData.receiptFileName,
                      'field-shell--active': stepTwoErrors.receiptFileName,
                    }"
                  >
                    <input class="upload-zone__input" type="file" accept=".png,.jpg,.jpeg,.pdf" @change="onReceiptUpload" />

                    <template v-if="receiptPreviewType === 'image' && receiptPreviewUrl">
                      <img class="upload-zone__preview" :src="receiptPreviewUrl" alt="Receipt preview" />
                      <div class="upload-zone__overlay">
                        <span class="upload-zone__file-name">{{ formData.receiptFileName }}</span>
                        <span class="upload-zone__hint">{{ t.reg.uploadChange }}</span>
                      </div>
                    </template>

                    <template v-else>
                      <v-icon class="upload-zone__icon" icon="mdi-cloud-upload-outline" size="70" />
                      <p class="upload-zone__text">
                        <template v-if="formData.receiptFileName">{{ formData.receiptFileName }}</template>
                        <template v-else>{{ t.reg.uploadClick }}</template>
                      </p>
                      <span class="upload-zone__hint">
                        <template v-if="receiptPreviewType === 'document'">{{ t.reg.uploadDocDone }}</template>
                        <template v-else>{{ t.reg.uploadHint }}</template>
                      </span>
                    </template>
                  </label>
                </div>
              </v-form>

              <v-form v-else class="form-grid form-grid--step-three">
                <div class="form-row form-row--full">
                  <label>{{ t.reg.vehicleBrand }}</label>
                  <div class="field-shell" :class="{ 'field-shell--active': stepThreeErrors.vehicleBrandModel }">
                    <input v-model="formData.vehicleBrandModel" type="text" :placeholder="t.reg.vehicleBrandPh" />
                  </div>
                </div>

                <div class="form-row">
                  <label>{{ t.reg.licensePlate }}</label>
                  <div class="field-shell" :class="{ 'field-shell--active': stepThreeErrors.licensePlate }">
                    <input v-model="formData.licensePlate" type="text" :placeholder="t.reg.licensePlatePh" />
                  </div>
                </div>

                <div class="form-row">
                  <label>{{ t.reg.regProvince }}</label>
                <div class="field-shell" :class="{ 'field-shell--active': stepThreeErrors.registrationProvince }">
                    <select v-model="formData.registrationProvince" class="field-shell__select">
                      <option value="" disabled>{{ t.reg.regProvincePh }}</option>
                      <option v-for="province in thailandProvinces" :key="`vehicle-${province}`" :value="province">{{ province }}</option>
                    </select>
                    <v-icon icon="mdi-chevron-down" size="18" />
                  </div>
                </div>

                <label class="terms-check form-row form-row--full" :class="{ 'terms-check--active': stepThreeErrors.acceptedTerms }">
                  <input v-model="formData.acceptedTerms" type="checkbox" />
                  <span class="terms-check__box"></span>
                  <span class="terms-check__text">{{ t.reg.termsCheck }}</span>
                </label>

                <div class="notice-banner form-row form-row--full">
                  <div class="notice-banner__icon">!</div>
                  <p>{{ t.reg.noticePrefix }} {{ maskedPhone }}</p>
                </div>
              </v-form>

              <div class="action-row" :class="{ 'action-row--between': currentStep > 1 }">
                <button v-if="currentStep > 1" class="secondary-cta" type="button" @click="goToPreviousStep">{{ t.reg.btnBack }}</button>
                <button class="primary-cta" type="button" :disabled="isSubmitting" @click="goToNextStep">
                  <span>{{ currentStep === 1 ? t.reg.btnNext : currentStep === 2 ? t.reg.btnSave : t.reg.btnSubmit }}</span>
                  <v-icon v-if="currentStep === 2" icon="mdi-chevron-right" size="22" />
                </button>
              </div>
            </div>
          </template>

          <div v-else class="registration-complete">
            <div class="registration-complete__icon-wrap">
              <v-icon class="registration-complete__icon" icon="mdi-shield-check-outline" size="144" />
            </div>
            <h3>{{ t.reg.doneTitle }}</h3>
            <p>{{ t.reg.doneThank }}</p>
            <p>{{ t.reg.doneDesc1 }}</p>
            <p>{{ t.reg.doneDesc2 }}</p>
            <button class="primary-cta registration-complete__cta" type="button" @click="goHome">{{ t.reg.btnHome }}</button>
            <a class="registration-complete__link" href="#" @click.prevent="goToPage('terms')">{{ t.reg.termsLink }}</a>
          </div>
          </template>
        </section>

        <section class="feature-visual" aria-hidden="true">
          <div class="feature-visual__glow"></div>
          <img class="feature-visual__tires" src="/kinto_img/zone_6_img_2x.png" alt="" />
        </section>
      </main>

      <footer class="footer">
        <div class="footer__curve"></div>
        <div class="footer__content">
          <div class="footer__brand">
            <img src="/kinto_img/logo.png" alt="Kinto Tyres" />
          </div>

          <div class="footer__info">
            <div class="footer__contact-row">
              <div>
                <h4>Call Center</h4>
                <p>02 108 9312</p>
              </div>
              <div class="footer__divider"></div>
              <div>
                <h4>Email</h4>
                <p>info@kinto-tyres.com</p>
              </div>
            </div>

            <div class="footer__address">
              <h4>{{ t.footer.location }}</h4>
              <p>{{ t.footer.companyName }}</p>
              <p>{{ t.footer.address1 }}</p>
              <p>{{ t.footer.address2 }}</p>
            </div>

            <div class="footer__social">
              <span>Follow us</span>
              <div class="social-icons">
                <span>f</span>
                <span>◎</span>
                <span>▶</span>
                <span>LINE</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer__bottom">
          FUJITA GIKEN CO., LTD. ©2026 ALL RIGHTS RESERVED. {{ t.footer.privacy }}
        </div>
      </footer>

      <v-dialog v-model="validationDialog" max-width="460">
        <div class="validation-modal">
          <div class="validation-modal__icon">!</div>
          <h3>{{ t.modal.title }}</h3>
          <p>{{ validationMessage }}</p>
          <button class="primary-cta validation-modal__button" type="button" @click="validationDialog = false">{{ t.modal.ok }}</button>
        </div>
      </v-dialog>
    </div>
  </v-app>
</template>
