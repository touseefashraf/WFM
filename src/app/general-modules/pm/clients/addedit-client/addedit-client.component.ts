
import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import * as moment from 'moment'
import { BsModalService } from 'ngx-bootstrap/modal'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from 'src/app/services/api.service'
import { DataService } from '../data.service'

@Component({
    selector: 'app-addedit-client',
    templateUrl: './addedit-client.component.html',
    styleUrls: ['./addedit-client.component.css']
})
export class AddeditClientComponent implements OnInit {
    dataStatus = 'fetching'
    clientForm: FormGroup
    selectedIndex: any
    selectedId: any
    queryIndex: any
    clientList = []
    minDate = new Date()
    imageChangedEvent: any
    cropperModalRef: any
    spinnerSVG = `/assets/images/spinner.svg`
    thumbnail: any = '/assets/img/default.png'
    croppedImage: any = ''
    loginLoading = false

    constructor(
        private ds: DataService,
        private router: Router,
        private route: ActivatedRoute,
        public api: ApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private ms: BsModalService,
    ) {

        this.clientForm = this.fb.group({
            id: new FormControl(null),
            title: new FormControl(null, [Validators.required]),
            gender: new FormControl(null, [Validators.required]),
            first_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            last_name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            dob: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(60)]),
            skype_id: new FormControl(null, [Validators.required, Validators.maxLength(80)]),
            contact_1: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            contact_2: new FormControl(null, [Validators.maxLength(15)]),
            address: new FormControl(null, [Validators.maxLength(255)]),
            description: new FormControl(null, [Validators.maxLength(1000)]),
        })

        this.queryIndex = this.route.snapshot.queryParamMap.get('index')
    }

    ngOnInit() {

        this.ds.getClient().subscribe((resp: any) => {
            if (resp.success === true) {
                this.clientList = resp.data
                this.dataStatus = 'done'
            }
            if (this.queryIndex != null) {

                if (this.queryIndex > -1) {

                    this.valuepatch(this.queryIndex)
                }
            }


        })
    }
    valuepatch(Index: number) {
        this.thumbnail = this.ds.clientImageUrl(this.clientList[Index].id) + '?' + JSON.stringify(new Date())
        // this.clientForm.controls.id.setValue(this.clientList[Index].id)
        this.clientForm.patchValue(this.clientList[Index])
        this.clientForm.controls.dob.setValue(new Date(this.clientList[Index].dob))

    }

    get g() {
        return this.clientForm.controls
    }




    save(f) {
        this.loginLoading = true
        if (this.clientForm.status === 'INVALID') {
            this.alert.error('Please enter valid clientForm in all fields and try again')
            this.loginLoading = false

            return false
        }
        const params = {
            id: this.clientForm.value.id,
            title: this.clientForm.value.title,
            gender: this.clientForm.value.gender,
            first_name: this.clientForm.value.first_name,
            last_name: this.clientForm.value.last_name,
            email: this.clientForm.value.email,
            skype_id: this.clientForm.value.skype_id,
            contact_1: this.clientForm.value.contact_1,
            contact_2: this.clientForm.value.contact_2,
            address: this.clientForm.value.address,
            description: this.clientForm.value.description,
            dob: moment(this.clientForm.value.dob).format('YYYY-MM-DD').toString()
        }
        fetch(this.thumbnail)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new Blob([blob])
                const formData = this.api.jsonToFormData(params)
                formData.append('image', imageFile)


                let saveUpdate = this.ds.addClient(formData)
                if (this.clientForm.value.id !== null) {
                    saveUpdate = this.ds.updateClient(formData)
                }
                saveUpdate.subscribe((resp: any) => {
                    this.loginLoading = false
                    if (resp.success === false) {
                        this.alert.error(resp.errors.general)
                        this.loginLoading = false

                        return false
                    }
                    else {
                        if (this.clientForm.value.id !== null) {
                            this.alert.success('Changes done successfully!!')
                            const mergeParams = {
                                id: this.clientForm.value.id,
                                title: this.clientForm.value.title,
                                gender: this.clientForm.value.gender,
                                first_name: this.clientForm.value.first_name,
                                last_name: this.clientForm.value.last_name,
                                email: this.clientForm.value.email,
                                skype_id: this.clientForm.value.skype_id,
                                contact_1: this.clientForm.value.contact_1,
                                contact_2: this.clientForm.value.contact_2,
                                address: this.clientForm.value.address,
                                description: this.clientForm.value.description,
                                dob: moment(this.clientForm.value.dob).format('YYYY-MM-DD').toString(),
                                timeStamp: JSON.stringify(new Date())
                            }
                            this.clientList[this.selectedIndex] = mergeParams
                            this.clientForm.controls.id.setValue(null)
                        }
                        else {
                            this.alert.success('Client added successfully!!')
                            const mergeParams = {
                                id: this.clientForm.value.id,
                                title: this.clientForm.value.title,
                                gender: this.clientForm.value.gender,
                                first_name: this.clientForm.value.first_name,
                                last_name: this.clientForm.value.last_name,
                                email: this.clientForm.value.email,
                                skype_id: this.clientForm.value.skype_id,
                                contact_1: this.clientForm.value.contact_1,
                                contact_2: this.clientForm.value.contact_2,
                                address: this.clientForm.value.address,
                                description: this.clientForm.value.description,
                                dob: moment(this.clientForm.value.dob).format('YYYY-MM-DD').toString(),
                            }
                            this.clientList.push(mergeParams)
                        }
                    }
                    f.resetForm()
                    this.thumbnail = '/assets/img/default.png'
                    this.router.navigateByUrl(`/${this.api.user.user_type}/clients/client-list`)
                })
            })



        // this.ds.addClient(this.clientForm.value).subscribe((resp: any) => {
        //     if (resp.success === true) {
        //         this.alert.success('Project added successfully')
        //         if (this.selectedIndex > -1) {
        //             this.clientList[this.selectedIndex] = resp.data
        //         }
        //         else {
        //             this.clientList.push(resp.data)
        //         }
        //         f.resetForm()
        //     }
        //     else {
        //         this.alert.error(resp.errors.general)
        //     }
        // })
    }

    browseThumbnail(event: any) {
        event.preventDefault()
        const element = document.getElementById('thumbnail-image')
        element.click()
    }

    onThumbnailChange(event: any, template: TemplateRef<any>) {
        const file = event.target.files[0]
        const allowedExtensions = ['png', 'jpg', 'jpeg']
        const extension = file.name.split('.').pop().toLowerCase()
        const fileSize = file.size / 1024 / 1024
        if (fileSize > 3) {
            this.alert.error('Invalid file size. File size must not exceeds 3MB')
        } else if (allowedExtensions.indexOf(extension) < 0) {
            this.alert.error('Invalid file type. Only png, jpg or jpeg are allowed')
        } else {
            this.imageChangedEvent = event
            this.cropperModalRef = this.ms.show(
                template,
                Object.assign({}, { class: 'modal-md modal-dialog-centered admin-panel' })
            )
        }
    }

    doneCroppingThumbnail() {
        this.thumbnail = this.croppedImage
        document.getElementById('banner-img').setAttribute('src', this.thumbnail)
        this.cropperModalRef.hide()
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64
    }
    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

}
