import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'Admin',
  title: 'Property Suchna',
  
  projectId: 'gou24j6u',
  dataset: 'production',
  
  plugins: [deskTool()],
  
  schema: {
    types: schemaTypes,
  },
})
