import { apis } from './../../../../../environments/environment'
import { DataService } from '../data.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiService } from '../../../../services/api.service'
import { IAlertService } from '../../../../libs/ialert/ialerts.service'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
    selector: 'app-projects-document',
    templateUrl: './projects-document.component.html',
    styleUrls: ['./projects-document.component.css']
})
export class ProjectsDocumentComponent implements OnInit {
    @Input() modalRef: BsModalRef
    @Input() index: number
    uploadedFiles = []
    projectId: any
    spinnerSVG: string
    mRef: BsModalRef
    deletionIds: any = []
    sub: any
    clients = []
    dataStatus = 'fetching'
    documentsList = []

    constructor(
        public api: ApiService,
        public dataService: DataService,
        private modalService: BsModalService,
        private alert: IAlertService,
        private router: Router,
        private route: ActivatedRoute,
        private _sanitizer: DomSanitizer,
    ) {
        this.spinnerSVG = `/assets/images/spinner.svg`
        this.projectId = this.route.snapshot.queryParamMap.get('id')
        this.dataService
            .getProjectDocuments(this.projectId)
            .subscribe((resp: any) => {
                if (resp.success) {
                    this.documentsList = resp.data
                    // console.log('Document List', this.documentsList)
                    this.documentsList.forEach((resp: any) => {
                        this.uploadedFiles.push({
                            id: resp.id,
                            project_id: this.projectId,
                            name: resp.name,
                            size: resp.size,
                            extension: resp.name.split('.').pop()
                        })
                    })
                    // console.log('Uploaded Files', this.uploadedFiles)
                    this.dataStatus = 'done'
                }
            })
    }

    ngOnInit() {
    }

    onDocumentChange(event: any) {
        this.uploadFiles(event.target.files)
    }

    uploadFiles(files: FileList) {
        const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'docx', 'xlsx', 'csv']
        const defaulterFiles = []

        Array.from(files).forEach((file: File) => {
            const extension = file.name.split('.').pop().toLowerCase()
            if (this.checkFileExist(file)) {
                return false
            }
            if (allowedExtensions.indexOf(extension) > -1) {
                this.readFile(file, extension)
            } else {
                defaulterFiles.push(file.name)
                this.alert.error(`${file.name} has an invalid file type. Only pdf, jpg, jpeg, png, docx, xlsx, csv are are allowed`)
            }
        })
    }

    checkFileExist(file) {
        let fileExist: boolean
        this.uploadedFiles.forEach(d => {
            if (file.name.split('.')[0] === d.name) {
                fileExist = true
            }
        })
        if (fileExist) {
            this.alert.error(`${file.name} is already added `)

            return true
        } else {
            return false
        }
    }
    readFile(file: File, ext: string) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (e: any) => {
            const index = this.uploadedFiles.length
            this.uploadedFiles.push({
                id: -1,
                file: reader.result,
                uploading: true,
                extension: ext,
                name: file.name,
                size: file.size
            })
            this.uploadDocument(reader.result, index, file)
        }
    }

    uploadDocument(fileData: any, index: number, file: File) {
        fetch(fileData)
            .then(res => res.blob())
            .then(blob => {
                const myFile = new Blob([blob]) // for microsoft edge support
                const formData = new FormData()
                formData.append('document', myFile)
                formData.append('name', file.name)
                formData.append('size', file.size.toString())
                formData.append('project_id', this.projectId)
                this.dataService.uploadFile(formData).subscribe((resp: any) => {
                    if (resp.success == true) {
                        this.uploadedFiles[index].id = resp.data
                        this.uploadedFiles[index].uploading = false
                        this.alert.success(`${this.uploadedFiles[index].name} uploaded successfully`)
                    } else {
                        this.alert.error(resp.errors.general)
                        this.uploadedFiles[index].uploading = false
                    }
                })// upload api
            })
    }

    deleteFile(index: number) {
        let delId = this.uploadedFiles[index].id
        console.log('Deletion ID', delId)

        this.uploadedFiles[index].image = this.spinnerSVG
        this.uploadedFiles.splice(index, 1)
        this.uploadedFiles.splice(index, 0, {
            deletion: true,
        })

        const params = {
            id: delId,
            project_id: this.projectId,
            file_type: 'document'
        }

        this.dataService.deleteFile(params).subscribe(resp => {
            if (resp.success == true) {
                // this.uploadedFiles[index].deletion = false
                this.uploadedFiles.splice(index, 1)
                const i = this.dataService.projectDetails.documents.findIndex((img: any) => img.id === params.id)
                this.dataService.projectDetails.documents.splice(i, 1)
            } else {
                this.alert.error(resp.errors.general)
                delete this.uploadedFiles[index].image
            }
        })
    }

    getProjectFile(fileId: number, file: any) {
        this.dataService.getProjectFile(fileId).subscribe((resp: any) => {
            const downloadLink = document.createElement('a')
            downloadLink.href = window.URL.createObjectURL(new Blob([resp], { type: resp.type }))
            // console.log('Response Type ', resp.type)
            if (file.name) {
                downloadLink.setAttribute('download', file.name.split(".")[0])
            } else {
                downloadLink.setAttribute('download', 'document')
            }
            document.body.appendChild(downloadLink)
            downloadLink.click()
        })
    }

    viewProjectFile(id) {
        return this._sanitizer.bypassSecurityTrustResourceUrl(`${apis.baseUrl}/project/get-project-file/${id}`)
    }


    fileDragStart(e: any): void {
        e.preventDefault()
        e.target.classList.add('highlight')
    }

    fileDragEnd(e: any): void {
        e.preventDefault()
        e.target.classList.remove('highlight')
    }

    fileDropped(e: any): void {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer && e.dataTransfer.files.length) {
            this.uploadFiles(e.dataTransfer.files)
        }
        e.target.classList.remove('highlight')
    }

    browseFiles(event: any) {
        event.preventDefault()
        const element = document.getElementById('other-files')
        element.click()
    }

    // cancel() {
    //     this.router.navigateByUrl('/agency/property/list')
    // }
    getFileIcon(ext: string) {
        const defaultIcon = 'far fa-file'
        const extensions = {
            pdf: 'far fa-file-pdf',
            png: 'far fa-file-image',
            jpg: 'far fa-file-image',
            jpeg: 'far fa-file-image',
            docx: 'fa fa-file-word-o',
            xlsx: 'fa fa-file-excel-o',
            csv: 'fas fa-file-csv'
        }

        return extensions[ext] ? extensions[ext] : defaultIcon
    }

    goToBack() {
        this.router.navigate(['admin/projects/general-details'], { queryParams: { id: this.projectId }, replaceUrl: true })
    }
    goToNext() {
        this.router.navigate(['admin/projects/project-milestones'], { queryParams: { id: this.projectId }, replaceUrl: true })
    }

}
