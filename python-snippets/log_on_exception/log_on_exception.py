from functools import wraps


def log(utf8_string, tags):
    """
    For the purpose of this question you can assume you have a function with
    the following signature available to do your logs calls for you.

    Tags are also logged to the screen to allow the user to easily search
    and debug exceptions.

    :param utf8_string: an utf8 string.
    :param tags: the tags.
    """
    print('{} {}'.format(':'.join(tags), utf8_string))


def log_on_exception(*tags):
    """
    log_on_exception takes tag strings as input, and instantiates the
    decorated function, if the decorated function raises an exception, then
    it logs the tags and the error message to the console.

    :param tags: list of tag strings.
    :return: the decorator
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            """
            decorated_function wraps the function, it calls the function
            passing all arguments and keyword arguments. It catches all
            exceptions and logs to the console.

            :param args: all *args.
            :param kwargs: all **kwargs.
            :exception: logs tags and error message to the console.
            :return: the output from the decorated function.
            """
            try:
                return f(*args, **kwargs)
            except Exception as e:
                log(str(e), tags)
        return decorated_function
    return decorator


@log_on_exception('tag1', 'tag2')
def fn():
    raise Exception('Some message')
