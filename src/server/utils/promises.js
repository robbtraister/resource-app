'use strict'

import fs from 'fs'
import { promisify } from 'util'

export const readFile = promisify(fs.readFile.bind(fs))
