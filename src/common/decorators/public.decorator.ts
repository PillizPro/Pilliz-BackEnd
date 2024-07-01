import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY_DECORATOR = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY_DECORATOR, true)
