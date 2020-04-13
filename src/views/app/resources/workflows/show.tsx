'use strict'

import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { useConfig } from 'react-router-resource'

import { Loading } from '../../components/loading'
import { useMounted } from '../../hooks/useMounted'

import { Resources } from '..'

export const ShowWorkflow = ({
  resources: { workflow }
}: {
  resources: Resources
}) => {
  const history = useHistory()
  const { client, path } = useConfig()

  const mounted = useMounted()
  const [saveDisabled, setSaveDisabled] = useState(false)

  return workflow ? (
    <>
      <h3>{workflow.name}</h3>
      <button
        disabled={saveDisabled}
        onClick={() => {
          setSaveDisabled(true)
          client.upsert(workflow).then(workflow => {
            history.replace(`${path}/${workflow.id}`)
            if (mounted.current) {
              setSaveDisabled(false)
            }
          })
        }}>
        Save
      </button>
    </>
  ) : (
    <Loading />
  )
}

ShowWorkflow.displayName = 'Workflow.Show'

export default ShowWorkflow
