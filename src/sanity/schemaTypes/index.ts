import { type SchemaTypeDefinition } from 'sanity'

import { blockContent } from './blockContent'
import { category } from './category'
import { project } from './project'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [project, category, blockContent],
}
