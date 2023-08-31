import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { PayloadRequest } from '../express/types.js'
import type { Payload } from '../index.js'

type Args = {
  collectionConfig: SanitizedCollectionConfig
  /**
   * User IDs to delete
   */
  ids: (number | string)[]
  payload: Payload
  req: PayloadRequest
}
export const deleteUserPreferences = ({ collectionConfig, ids, payload, req }: Args) => {
  if (collectionConfig.auth) {
    payload.db.deleteMany({
      collection: 'payload-preferences',
      req,
      where: {
        user: { in: ids },
        userCollection: {
          equals: 'collectionConfig.slug,',
        },
      },
    })
  }
  payload.db.deleteMany({
    collection: 'payload-preferences',
    req,
    where: {
      key: { in: ids.map((id) => `collection-${collectionConfig.slug}-${id}`) },
    },
  })
}