'use strict'

import express from 'express'

import datasets from './datasets.json'
import projects from './projects.json'
import workflows from './workflows.json'

export default function projectsRouter(options) {
  const projectsRouter = express()

  projectsRouter.get('/', (req, res, next) => {
    const sortBy = req.query.sortBy || 'name'
    const descending = /^(true|on|1)$/i.test(req.query.desc)

    const results = [].concat(projects || [])
    results.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
    if (descending) {
      results.reverse()
    }

    res.send({ projects: results })
  })
  projectsRouter.get('/:projectId', (req, res, next) => {
    res.send({
      project: projects.find(project => project.id === req.params.projectId)
    })
  })
  projectsRouter.get('/:projectId/datasets', (req, res, next) => {
    const sortBy = req.query.sortBy || 'name'
    const descending = /^(true|on|1)$/i.test(req.query.desc)

    const results = [].concat(datasets[req.params.projectId] || [])
    results.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
    if (descending) {
      results.reverse()
    }

    res.send({ datasets: results })
  })
  projectsRouter.get('/:projectId/datasets/:datasetId', (req, res, next) => {
    const projectDatasets = datasets[req.params.projectId] || []
    res.send({
      dataset: projectDatasets.find(
        dataset => dataset.id === req.params.datasetId
      )
    })
  })
  projectsRouter.get('/:projectId/workflows', (req, res, next) => {
    const sortBy = req.query.sortBy || 'name'
    const descending = /^(true|on|1)$/i.test(req.query.desc)

    const results = [].concat(workflows[req.params.projectId] || [])
    results.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
    if (descending) {
      results.reverse()
    }

    res.send({ workflows: results })
  })
  projectsRouter.get('/:projectId/workflows/:workflowId', (req, res, next) => {
    const projectWorkflows = workflows[req.params.projectId] || []
    res.send({
      workflow: projectWorkflows.find(
        workflow => workflow.id === req.params.workflowId
      )
    })
  })

  return projectsRouter
}
