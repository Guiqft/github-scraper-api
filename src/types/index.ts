export interface IFile {
    name: string,
    extension: string,
    url: string,
    isFolder: boolean,
    size: ISize
}

export interface IRepository {
    name: string,
    owner: string,
    url: string
}

export interface ISize {
    lines?: number,
    bytes?: number
}