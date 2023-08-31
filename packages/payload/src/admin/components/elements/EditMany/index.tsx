import { useModal } from '@faceless-ui/modal'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Props } from './types.js'

import { getTranslation } from '../../../../utilities/getTranslation.js'
import { useForm } from '../../forms/Form/context.js'
import Form from '../../forms/Form/index.js'
import RenderFields from '../../forms/RenderFields/index.js'
import FormSubmit from '../../forms/Submit/index.js'
import fieldTypes from '../../forms/field-types/index.js'
import X from '../../icons/X/index.js'
import { useAuth } from '../../utilities/Auth/index.js'
import { useConfig } from '../../utilities/Config/index.js'
import { OperationContext } from '../../utilities/OperationProvider/index.js'
import {
  SelectAllStatus,
  useSelection,
} from '../../views/collections/List/SelectionProvider/index.js'
import { Drawer, DrawerToggler } from '../Drawer/index.js'
import { FieldSelect } from '../FieldSelect/index.js'
import './index.scss'

const baseClass = 'edit-many'

const Submit: React.FC<{ action: string; disabled: boolean }> = ({ action, disabled }) => {
  const { submit } = useForm()
  const { t } = useTranslation('general')

  const save = useCallback(() => {
    submit({
      action,
      method: 'PATCH',
      skipValidation: true,
    })
  }, [action, submit])

  return (
    <FormSubmit className={`${baseClass}__save`} disabled={disabled} onClick={save}>
      {t('save')}
    </FormSubmit>
  )
}
const Publish: React.FC<{ action: string; disabled: boolean }> = ({ action, disabled }) => {
  const { submit } = useForm()
  const { t } = useTranslation('version')

  const save = useCallback(() => {
    submit({
      action,
      method: 'PATCH',
      overrides: {
        _status: 'published',
      },
      skipValidation: true,
    })
  }, [action, submit])

  return (
    <FormSubmit className={`${baseClass}__publish`} disabled={disabled} onClick={save}>
      {t('publishChanges')}
    </FormSubmit>
  )
}
const SaveDraft: React.FC<{ action: string; disabled: boolean }> = ({ action, disabled }) => {
  const { submit } = useForm()
  const { t } = useTranslation('version')

  const save = useCallback(() => {
    submit({
      action,
      method: 'PATCH',
      overrides: {
        _status: 'draft',
      },
      skipValidation: true,
    })
  }, [action, submit])

  return (
    <FormSubmit className={`${baseClass}__draft`} disabled={disabled} onClick={save}>
      {t('saveDraft')}
    </FormSubmit>
  )
}
const EditMany: React.FC<Props> = (props) => {
  const { collection: { fields, labels: { plural }, slug } = {}, collection, resetParams } = props

  const { permissions } = useAuth()
  const { closeModal } = useModal()
  const {
    routes: { api },
    serverURL,
  } = useConfig()
  const { count, getQueryParams, selectAll } = useSelection()
  const { i18n, t } = useTranslation('general')
  const [selected, setSelected] = useState([])

  const collectionPermissions = permissions?.collections?.[slug]
  const hasUpdatePermission = collectionPermissions?.update?.permission

  const drawerSlug = `edit-${slug}`

  if (selectAll === SelectAllStatus.None || !hasUpdatePermission) {
    return null
  }

  const onSuccess = () => {
    resetParams({ page: selectAll === SelectAllStatus.AllAvailable ? 1 : undefined })
  }

  return (
    <div className={baseClass}>
      <DrawerToggler
        onClick={() => {
          setSelected([])
        }}
        aria-label={t('edit')}
        className={`${baseClass}__toggle`}
        slug={drawerSlug}
      >
        {t('edit')}
      </DrawerToggler>
      <Drawer header={null} slug={drawerSlug}>
        <OperationContext.Provider value="update">
          <Form className={`${baseClass}__form`} onSuccess={onSuccess}>
            <div className={`${baseClass}__main`}>
              <div className={`${baseClass}__header`}>
                <h2 className={`${baseClass}__header__title`}>
                  {t('editingLabel', { count, label: getTranslation(plural, i18n) })}
                </h2>
                <button
                  aria-label={t('close')}
                  className={`${baseClass}__header__close`}
                  id={`close-drawer__${drawerSlug}`}
                  onClick={() => closeModal(drawerSlug)}
                  type="button"
                >
                  <X />
                </button>
              </div>
              <FieldSelect fields={fields} setSelected={setSelected} />
              <RenderFields fieldSchema={selected} fieldTypes={fieldTypes} />
              <div className={`${baseClass}__sidebar-wrap`}>
                <div className={`${baseClass}__sidebar`}>
                  <div className={`${baseClass}__sidebar-sticky-wrap`}>
                    <div className={`${baseClass}__document-actions`}>
                      <Submit
                        action={`${serverURL}${api}/${slug}${getQueryParams()}`}
                        disabled={selected.length === 0}
                      />
                      {collection.versions && (
                        <React.Fragment>
                          <Publish
                            action={`${serverURL}${api}/${slug}${getQueryParams()}`}
                            disabled={selected.length === 0}
                          />
                          <SaveDraft
                            action={`${serverURL}${api}/${slug}${getQueryParams()}`}
                            disabled={selected.length === 0}
                          />
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </OperationContext.Provider>
      </Drawer>
    </div>
  )
}

export default EditMany