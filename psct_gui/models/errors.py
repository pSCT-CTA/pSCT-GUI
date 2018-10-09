import datetime

class ErrorLog:

    """
    var error = {
        name: errorName,
        code: errorCode,
        description: errorDesc,
        severity: errorSev,
        source: errorSource,
    };
    """

    def __init__():
        self.errors = {}

    @staticmethod
    def get_unique_ID(error_source, error_code):
        return error_source + "_" + str(error_code)

    def get_errors(self): 
        return list(self.errors.values())


    def sync_errors(self):
        pass


    def add_error(self, error):
        error_id = this.get_unique_ID(error.source, error.code)
        if not error_id in self.errors:
            error.timestamp = datetime.datetime.now()
            error.show = True
            error.id = error_id

            self.errors[error_id] =  error
            # Notify

    def remove_error(self, error_id):
        if error_id in self.errors:
            del self.errors[error_id]
            # Notify

    def toggle_hide_errors(self, error_ids):
        for error_id in error_ids:
            self.errors[error_id].show = not self.errors[error_id].show
        # notify 
