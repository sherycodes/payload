import type { SanitizedConfig } from 'payload/types'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  AlignFeature,
  BlockQuoteFeature,
  BlocksFeature,
  BoldFeature,
  CheckListFeature,
  HeadingFeature,
  IndentFeature,
  InlineCodeFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  TreeViewFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
// import { slateEditor } from '@payloadcms/richtext-slate'
import { type Config, buildConfig } from 'payload/config'
import { de } from 'payload/i18n/de'
import { en } from 'payload/i18n/en'
import { es } from 'payload/i18n/es'
import sharp from 'sharp'

import { reInitEndpoint } from './helpers/reInit.js'
import { localAPIEndpoint } from './helpers/sdk/endpoint.js'

process.env.PAYLOAD_DATABASE = 'postgres'
process.env.POSTGRES_URL = 'postgres://postgres:postgres@127.0.0.1:5432/payload'

// supabase
// process.env.POSTGRES_URL = 'postgres://postgres.yvldwtfficcutluczvxo:T8teQXJdXEEVWKuY@aws-0-us-east-1.pooler.supabase.com:6543/postgres'

//neon
// process.env.POSTGRES_URL = 'postgresql://DanRibbens:5ViPSnrJl7FM@ep-crimson-fire-a5ufz91h.us-east-2.aws.neon.tech/payload?sslmode=require'
// neon Pooled
// process.env.POSTGRES_URL = 'postgresql://DanRibbens:5ViPSnrJl7FM@ep-crimson-fire-a5ufz91h-pooler.us-east-2.aws.neon.tech/payload?sslmode=require'

// process.env.PAYLOAD_DROP_DATABASE = 'false'
// process.env.PAYLOAD_TEST_MONGO_URL =
//   'mongodb://test:newPassword1-@ac-qrqtfky-shard-00-00.iflydoh.mongodb.net:27017,ac-qrqtfky-shard-00-01.iflydoh.mongodb.net:27017,ac-qrqtfky-shard-00-02.iflydoh.mongodb.net:27017/?replicaSet=atlas-12au03-shard-0'
// process.env.PAYLOAD_TEST_MONGO_URL =
//   'mongodb+srv://test:newPassword1-@cc2e23e7-d3ef-4854-a10d.iflydoh.mongodb.net/payload?retryWrites=true&w=majority'

// dockerized azure cosmosdb emulator not working at all
// process.env.PAYLOAD_TEST_MONGO_URL =
//   'mongodb://localhost:C2y6yDjf5%2FR%2Bob0N8A7Cgv30VRDJIWEHLM%2B4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw%3D%3D@localhost:10255/admin?tls=true&tlsCertificateKeyFilePassword=C2y6yDjf5%2FR%2Bob0N8A7Cgv30VRDJIWEHLM%2B4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw%2FJw%3D%3D&tlsAllowInvalidCertificates=true&retrywrites=false'

// AZURE COSMOS
// process.env.DATABASE_URI =
//   'mongodb://payload-test:MHLZIZo56vBs3KgcahncN9iZXvyobgjNwuptN3O7g2S11FpfJI2g2pWI8MZiXlGUQClZJXl2Xdc7ACDbMCjovA%3D%3D@payload-test.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@payload-test@'

export async function buildConfigWithDefaults(
  testConfig?: Partial<Config>,
): Promise<SanitizedConfig> {
  const databaseAdapters = {
    mongodb: mongooseAdapter({
      url:
        process.env.MONGODB_MEMORY_SERVER_URI ||
        process.env.DATABASE_URI ||
        'mongodb://127.0.0.1/payloadtests',
    }),
    postgres: postgresAdapter({
      pool: {
        connectionString: process.env.POSTGRES_URL || 'postgres://127.0.0.1:5432/payloadtests',
      },
    }),
    'postgres-custom-schema': postgresAdapter({
      pool: {
        connectionString: process.env.POSTGRES_URL || 'postgres://127.0.0.1:5432/payloadtests',
      },
      schemaName: 'custom',
    }),
    'postgres-uuid': postgresAdapter({
      idType: 'uuid',
      pool: {
        connectionString: process.env.POSTGRES_URL || 'postgres://127.0.0.1:5432/payloadtests',
      },
    }),
    supabase: postgresAdapter({
      pool: {
        connectionString:
          process.env.POSTGRES_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
      },
    }),
  }

  const config: Config = {
    db: databaseAdapters[process.env.PAYLOAD_DATABASE || 'mongodb'],
    secret: 'TEST_SECRET',
    //editor: slateEditor({}),
    // editor: slateEditor({
    //   admin: {
    //     upload: {
    //       collections: {
    //         media: {
    //           fields: [
    //             {
    //               name: 'alt',
    //               type: 'text',
    //             },
    //           ],
    //         },
    //       },
    //     },
    //   },
    // }),
    endpoints: [localAPIEndpoint, reInitEndpoint],
    editor: lexicalEditor({
      features: [
        ParagraphFeature(),
        RelationshipFeature(),
        LinkFeature({
          fields: [
            {
              name: 'description',
              type: 'text',
            },
          ],
        }),
        CheckListFeature(),
        UnorderedListFeature(),
        OrderedListFeature(),
        AlignFeature(),
        BlockQuoteFeature(),
        BoldFeature(),
        ItalicFeature(),
        UploadFeature({
          collections: {
            media: {
              fields: [
                {
                  name: 'alt',
                  type: 'text',
                },
              ],
            },
          },
        }),
        UnderlineFeature(),
        StrikethroughFeature(),
        SubscriptFeature(),
        SuperscriptFeature(),
        InlineCodeFeature(),
        TreeViewFeature(),
        HeadingFeature(),
        IndentFeature(),
        BlocksFeature({
          blocks: [
            {
              slug: 'myBlock',
              fields: [
                {
                  name: 'someText',
                  type: 'text',
                },
                {
                  name: 'someTextRequired',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'radios',
                  type: 'radio',
                  options: [
                    {
                      label: 'Option 1',
                      value: 'option1',
                    },
                    {
                      label: 'Option 2',
                      value: 'option2',
                    },
                    {
                      label: 'Option 3',
                      value: 'option3',
                    },
                  ],
                  validate: (value) => {
                    return value !== 'option2' ? true : 'Cannot be option2'
                  },
                },
              ],
            },
          ],
        }),
      ],
    }),
    sharp,
    telemetry: false,
    typescript: {
      declare: false,
    },
    ...testConfig,
    i18n: {
      supportedLanguages: {
        en,
        es,
        de,
      },
      ...(testConfig?.i18n || {}),
    },
  }

  config.admin = {
    autoLogin:
      process.env.PAYLOAD_PUBLIC_DISABLE_AUTO_LOGIN === 'true'
        ? false
        : {
            email: 'dev@payloadcms.com',
            password: 'test',
          },
    ...(config.admin || {}),
  }

  if (process.env.PAYLOAD_DISABLE_ADMIN === 'true') {
    if (typeof config.admin !== 'object') config.admin = {}
    config.admin.disable = true
  }

  return buildConfig(config)
}
