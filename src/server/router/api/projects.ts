'use strict'

import express from 'express'

import datasets from './datasets.json'
import projects from './projects.json'
import workflows from './workflows.json'

const PER_PAGE = 5

export default function projectsRouter(options) {
  const projectsRouter = express()

  projectsRouter.get('/', (req, res, next) => {
    const page = +(req.query.page || 1) - 1
    const sortBy = req.query.sortBy || 'name'
    const descending = /^(true|on|1)$/i.test(req.query.desc)

    const results = []
      .concat(projects || [])
      .map(project =>
        Object.assign({}, project, { name: `${project.name} - ${Date.now()}` })
      )
    results.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
    if (descending) {
      results.reverse()
    }

    res.send({
      projects: results.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
    })
  })
  projectsRouter.get('/:projectId', (req, res, next) => {
    const project = projects.find(
      project => project.id === req.params.projectId
    )
    res.send({
      project: Object.assign({}, project, {
        name: `${project.name} - ${Date.now()}`
      })
    })
  })
  projectsRouter.get('/:projectId/datasets', (req, res, next) => {
    const sortBy = req.query.sortBy || 'name'
    const descending = /^(true|on|1)$/i.test(req.query.desc)

    const results = []
      .concat(datasets[req.params.projectId] || [])
      .map(dataset =>
        Object.assign({}, dataset, { name: `${dataset.name} - ${Date.now()}` })
      )
    results.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
    if (descending) {
      results.reverse()
    }

    res.send({ datasets: results })
  })
  projectsRouter.get('/:projectId/datasets/:datasetId', (req, res, next) => {
    const projectDatasets = datasets[req.params.projectId] || []
    const dataset = projectDatasets.find(
      dataset => dataset.id === req.params.datasetId
    )
    res.send({
      dataset: Object.assign({}, dataset, {
        name: `${dataset.name} - ${Date.now()}`
      })
    })
  })
  projectsRouter.get('/:projectId/workflows', (req, res, next) => {
    const sortBy = req.query.sortBy || 'name'
    const descending = /^(true|on|1)$/i.test(req.query.desc)

    const results = []
      .concat(workflows[req.params.projectId] || [])
      .map(workflow =>
        Object.assign({}, workflow, {
          name: `${workflow.name} - ${Date.now()}`
        })
      )
    results.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
    if (descending) {
      results.reverse()
    }

    res.send({ entries: results })
  })
  projectsRouter.get('/:projectId/workflows/:workflowId', (req, res, next) => {
    const projectWorkflows = workflows[req.params.projectId] || []
    const workflow = projectWorkflows.find(
      workflow => workflow.id === req.params.workflowId
    )
    res.send({
      entry: Object.assign({}, workflow, {
        name: `${workflow.name} - ${Date.now()}`
      })
    })
  })

  return projectsRouter
}
