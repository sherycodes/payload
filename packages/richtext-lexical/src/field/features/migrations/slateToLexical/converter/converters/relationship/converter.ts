import type { SerializedRelationshipNode } from '../../../../../relationship/nodes/RelationshipNode.js'
import type { SlateNodeConverter } from '../../types.js'

export const _SlateRelationshipConverter: SlateNodeConverter = {
  converter({ slateNode }) {
    return {
      type: 'relationship',
      format: '',
      relationTo: slateNode.relationTo,
      value: slateNode?.value?.id || '',
      version: 2,
    } as const as SerializedRelationshipNode
  },
  nodeTypes: ['relationship'],
}
