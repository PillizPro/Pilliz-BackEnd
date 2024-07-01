import { HttpStatus } from '@nestjs/common'

type PRISMA_CODE_TYPE<K extends string> = {
  [key in K]: {
    prismaCode: Array<string>
    returnStatusCode: HttpStatus
  }
}

const PRISMA_CODE: PRISMA_CODE_TYPE<'NOT_FOUND' | 'CONFLICT'> = {
  NOT_FOUND: {
    prismaCode: ['P2001', 'P2021', 'P2022', 'P2025'],
    returnStatusCode: HttpStatus.NOT_FOUND,
  },
  CONFLICT: {
    prismaCode: ['P2002', 'P2003', 'P2004'],
    returnStatusCode: HttpStatus.CONFLICT,
  },
}

export default PRISMA_CODE
