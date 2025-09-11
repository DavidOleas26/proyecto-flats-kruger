export class AuthorizationMiddleware {

  static authAdminMiddleware = (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "Access denied: Missing user role or authentication" })
    }

    const isAdmin = req.user.role === 'admin'
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied: Users do not have permission" })
    } 
    next()
  }

  static authUserMiddleware = (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "Access denied: Missing user role or authentication" })
    }
  
    const isSameUser = req.params.id === String(req.user.userId)
    const isAdmin = req.user.role === 'admin'
    if (!isSameUser && !isAdmin) {
      return res.status(403).json({ error: "Access denied: You do not have permission" })
    } 
    next()
  }
  
  static authUserUpdateMiddleware = (req, res, next) => {
    const { role, password, flatsCounter } = req.body || {};
    const isSameUser = req.params.id === String(req.user.userId)
    const isAdmin = req.user.role === 'admin'

    if ( isSameUser && req.user.role == 'user' && role) {
      return res.status(403).json({ error: "Normal users cannot modify their own role" })
    }

    if ( !isSameUser && isAdmin && password ) {
      return res.status(403).json({ error: "Admins are not allowed to change passwords of other users" })
    }

    if ( flatsCounter ) {
      return res.status(403).json({ error: "Flats Counter can not be updated" })
    }

    next()
  }

}
