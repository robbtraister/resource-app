'use strict'

import React, { useState, createRef, RefObject } from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.scss'

export const sidebarRef: RefObject<HTMLDivElement> = createRef()

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)

  const transformRef: React.RefObject<SVGAnimateTransformElement> = createRef()

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.content}>
        <div>
          <Link style={{ marginLeft: '5px', display: 'inline-block' }} to="/">
            <svg width="30" height="45" viewBox="0 0 40 60">
              <path
                d="M35,5h-30v50h30"
                stroke="#f80"
                fill="none"
                strokeWidth="5"
              />
            </svg>
          </Link>
          <hr />
          <div ref={sidebarRef} />
        </div>
        <div className={`${styles.left} ${styles['bottom-float']}`}>icons</div>
        <div className={`${styles.right} ${styles.bottom}`}>
          <a
            className={styles.toggle}
            onClick={() => {
              transformRef &&
                transformRef.current &&
                transformRef.current.beginElement()
              setCollapsed(collapsed => !collapsed)
            }}>
            <svg width="30" height="30" viewBox="-4 -4 8 8">
              <path
                d="M2,-3L-2,0L2,3"
                fill="none"
                strokeWidth="1.5"
                stroke="#000">
                <animateTransform
                  ref={transformRef}
                  attributeName="transform"
                  type="rotate"
                  from={collapsed ? '0' : '180'}
                  to={collapsed ? '180' : '0'}
                  begin="0s"
                  dur="0.5s"
                  fill="freeze"
                />
              </path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
