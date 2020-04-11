'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import { v4 } from 'uuid'

import datasets from './datasets.json'
import projects from './projects.json'
import workflows from './workflows.json'

const PER_PAGE = 5

export default function projectsRouter(options) {
  const projectsRouter = express()

  projectsRouter.use(bodyParser.json())

  projectsRouter.get('/', (req, res, next) => {
    const page = +(req.query.page || 1) - 1
    const perPage = +req.query.perPage || PER_PAGE
    const sortBy = req.query.sortBy || 'name'
    const descending = /^(true|on|1)$/i.test(req.query.desc)

    const results = ([] as { name: string }[])
      .concat(projects || [])
      .map(project =>
        Object.assign({}, project, { name: `${project.name} - ${Date.now()}` })
      )
    results.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
    if (descending) {
      results.reverse()
    }

    res.send({
      projects: results.slice(page * perPage, (page + 1) * perPage)
    })
  })
  projectsRouter.get('/:projectId', (req, res, next) => {
    const project = projects.find(
      project => project.id === req.params.projectId
    )
    res.send({
      project: Object.assign({}, project, {
        name: `${project ? project.name : 'N/A'} - ${Date.now()}`
      })
    })
  })

  projectsRouter.get('/:projectId/datasets', (req, res, next) => {
    const sortBy = req.query.sortBy || 'name'
    const descending = /^(true|on|1)$/i.test(req.query.desc)

    const results = ([] as { name: string }[])
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

    const results = ([] as { name: string }[])
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
  projectsRouter.post('/:projectId/workflows', (req, res, next) => {
    const projectWorkflows = workflows[req.params.projectId] || []
    const workflow = { ...req.body, id: v4() }
    projectWorkflows.push(workflow)
    res.send({ entry: workflow })
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
  projectsRouter.put('/:projectId/workflows/:workflowId', (req, res, next) => {
    const projectWorkflows = workflows[req.params.projectId] || []
    const workflow = projectWorkflows.find(
      workflow => workflow.id === req.params.workflowId
    )
    Object.assign(workflow, req.body)
    res.send({ entry: workflow })
  })

  return projectsRouter
}
