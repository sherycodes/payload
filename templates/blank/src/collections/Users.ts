import { CollectionConfig } from 'payload/types'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    { field: 'name', type: 'text', required: true },
    // Email added by default
    // Add more fields as needed
  ],
}

export default Users
