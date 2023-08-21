import { Create } from 'payload/dist/database/types';
import toSnakeCase from 'to-snake-case';
import { insertRow } from '../insertRow';

export const create: Create = async function create({
  collection: collectionSlug,
  data,
  req,
}) {
  const collection = this.payload.collections[collectionSlug].config;

  const result = await insertRow({
    adapter: this,
    data,
    fallbackLocale: req.fallbackLocale,
    fields: collection.fields,
    locale: req.locale,
    tableName: toSnakeCase(collectionSlug),
  });

  return result;
};