export interface IFile {
    name: string,
    extension: string,
    url: string,
    isFolder: boolean,
    lines?: number,
    bytes?: number
}

export interface IRepository {
    name: string,
    owner: string
}